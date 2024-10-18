package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type ExpenseData struct {
	Expense  uint32 `json:"expense"`
	Category string `json:"category"`
	Date     string `json:"date"`
	Comments string `json:"comments"`
}

func logInfo(message string) {
	timeStamp := fmt.Sprintf("%s", time.Now().Format("2006-01-02 15:04:05"))
	log.Println(message + " : " + timeStamp)
}

func saveToFile(data interface{}, fileName string) error {
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer file.Close()

	enc := json.NewEncoder(file)
	return enc.Encode(data)
}

const filePath = "db/data.json"

func readExpenses() ([]ExpenseData, error) {
	var expenses []ExpenseData

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		logInfo("File not found, returning empty expenses")
		return expenses, nil
	}

	file, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("error reading file: %v", err)
	}

	err = json.Unmarshal(file, &expenses)
	if err != nil {
		return nil, fmt.Errorf("error unmarshaling JSON: %v", err)
	}

	return expenses, nil
}

func writeExpenses(expenses []ExpenseData) error {
	data, err := json.MarshalIndent(expenses, "", "  ")
	if err != nil {
		return err
	}

	err = os.WriteFile(filePath, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func CreateExpense(w http.ResponseWriter, r *http.Request) {
	const apiName = "CREATE EXPENSE"
	logInfo(apiName + " : " + r.Method)
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusBadRequest)
		return
	}

	logInfo(apiName + " : Decoding JSON")
	var expenseData ExpenseData
	err := json.NewDecoder(r.Body).Decode(&expenseData)
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	logInfo(apiName + " : Validating data")
	if expenseData.Expense == 0 || expenseData.Category == "" || expenseData.Date == "" {
		http.Error(w, "All required fields must be filled in", http.StatusBadRequest)
		return
	}

	logInfo(apiName + " : Saving data")
	expenses, err := readExpenses()
	if err != nil {
		http.Error(w, "Error reading expenses from file", http.StatusInternalServerError)
		return
	}
	logInfo(apiName + " : " + fmt.Sprintf("%v", expenseData))
	expenses = append(expenses, expenseData)

	err = writeExpenses(expenses)
	if err != nil {
		http.Error(w, "Error writing expenses to file", http.StatusInternalServerError)
		return
	}

	logInfo(apiName + " : Success!")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

func GetExpenses(w http.ResponseWriter, r *http.Request) {
	const apiName = "GET EXPENSE"
	logInfo(apiName + " : " + r.Method)
	if r.Method != "GET" {
		http.Error(w, "Invalid request method", http.StatusBadRequest)
		return
	}

	logInfo(apiName + " : Reading expenses from file")
	expenses, err := readExpenses()
	if err != nil {
		http.Error(w, "Error reading expenses from file", http.StatusInternalServerError)
		return
	}

	logInfo(apiName + " : Success!")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(expenses)
}

func main() {
	http.HandleFunc("/api/expenses", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			GetExpenses(w, r)
		case "POST":
			CreateExpense(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	log.Println("The API server is running on port :4322")
	log.Fatal(http.ListenAndServe(":4322", nil))
}
