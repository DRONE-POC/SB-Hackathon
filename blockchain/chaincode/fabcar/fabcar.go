/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Car struct {
	Make   string `json:"make"`
	Model  string `json:"model"`
	Colour string `json:"colour"`
	Owner  string `json:"owner"`
}

type Customer struct {
	Name     string
	Email    string
	Password string
	Quotes   []Quote
	Policies []Policy
}

type Quote struct {
	Id          int64
	DeviceType  string
	DeviceImage string
	Premium     float64
	StartDate   string
	EndDate     string
	status      string
}

type Policy struct {
	Id          int64
	DeviceType  string
	DeviceImage string
	Premium     float64
	StartDate   string
	EndDate     string
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	fmt.Println("In the smart contract!")
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "createPolicy" {
		return s.createPolicy(APIstub, args)
	} else if function == "createCustomerProfile" {
		return s.createCustomerProfile(APIstub, args)
	} else if function == "createPolicy" {
		return s.createPolicy(APIstub, args)
	} else if function == "submitForQuote" {
		return s.submitForQuote(APIstub, args)
	} else if function == "getCustomerProfile" {
		return s.getCustomerProfile(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

//Invoke functions

func (s *SmartContract) createPolicy(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var prem, _ = strconv.ParseFloat(args[2], 64)
	var policy = Policy{DeviceType: args[0], DeviceImage: args[1], Premium: prem, StartDate: args[3], EndDate: args[4]}

	email := args[5]
	password := args[6]
	customerKey := email + "-" + password
	customerAsBytes, _ := APIstub.GetState(customerKey)
	customer := Customer{}

	json.Unmarshal(customerAsBytes, &customer)

	policyList := customer.Policies

	if len(policyList) > 0 {
		policy.Id = policyList[len(policyList)-1].Id + 1
	}

	updatedPolicyList := append(policyList, policy)
	customer.Policies = updatedPolicyList

	customerAsBytes, _ = json.Marshal(customer)
	APIstub.PutState(customerKey, customerAsBytes)

	resAsBytes, _ := json.Marshal("Sucess")
	return shim.Success(resAsBytes)
}

func (s *SmartContract) createCustomerProfile(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Println("Initial arguments : %s", args)

	if len(args) != 3 {
		fmt.Println("error")
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	customer := Customer{}
	customer.Name = args[0]
	customer.Email = args[1]
	customer.Password = args[2]
	var customerKey = customer.Email + "-" + customer.Password
	fmt.Println(customer)
	fmt.Println(customerKey)
	customerAsBytes, _ := json.Marshal(customer)
	APIstub.PutState(customerKey, customerAsBytes)
	resAsBytes, _ := json.Marshal("Sucess")
	return shim.Success(resAsBytes)
}

func (s *SmartContract) submitForQuote(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	//BUSINESS LOGIC HERE FOR RATING BASED ON INFORMATION
	deviceType := args[0]

	if deviceType == "iPhone" {
		prem := 0.30
	} else {
		prem := 0.25
	}

	//Create quote package
	var quote = Quote{DeviceType: deviceType, DeviceImage: args[1], Premium: prem, StartDate: args[3], EndDate: args[4]}

	//Auth
	email := args[5]
	password := args[6]
	customerKey := email + "-" + password

	customerAsBytes, _ := APIstub.GetState(customerKey)
	customer := Customer{}

	json.Unmarshal(customerAsBytes, &customer)

	quoteList := customer.Quotes

	if len(quoteList) > 0 {
		quote.Id = quoteList[len(quoteList)-1].Id + 1
	}

	updatedQuoteList := append(quoteList, quote)
	customer.Quotes = updatedQuoteList

	customerAsBytes, _ = json.Marshal(customer)
	APIstub.PutState(customerKey, customerAsBytes)

	quoteAsBytes, _ := json.Marshal(quote)
	return shim.Success(quoteAsBytes)
}

//Query functions

func (s *SmartContract) getCustomerProfile(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	customerEmail := args[0]
	customerPassword := args[1]

	customerKey := customerEmail + "-" + customerPassword
	customerAsBytes, _ := APIstub.GetState(customerKey)
	return shim.Success(customerAsBytes)
}

///////----------------------------------------------------------------------------------------------------------

func (s *SmartContract) queryCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(carAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	cars := []Car{
		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
	}

	i := 0
	for i < len(cars) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		fmt.Println("Added", cars[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var car = Car{Make: args[1], Model: args[2], Colour: args[3], Owner: args[4]}

	carAsBytes, _ := json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)
	fmt.Println("Created a car!")
	return shim.Success(nil)
}

func (s *SmartContract) queryAllCars(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeCarOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.Owner = args[1]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
