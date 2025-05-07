const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const path = require('path');
const filePath = path.join(__dirname, 'students.json');

class student{
    constructor(id,name, age, grade){
    this.id = id;
    this.name = name;
    this.age = age;
    this.grade = grade;
    }
}

class studentManager{
    constructor() {
        this.students = [];
        this.nextId = 1;
    }
    addStudent(name, age, grade){
        const Sdt = new student(this.nextId++, name, age, grade);
        this.students.push(Sdt);
        console.log(`Student ${name} added with ID ${Sdt.id}`);  
    }

    showAllStudents(){
        console.log("ID\tname\tAge\tGrade");
        this.students.forEach(student => {
            console.log(`${student.id}\t${student.name}\t${student.age}\t${student.grade}`);
        }
        );
    }
    searchStudentByName(name){
        const studentFound = this.students.filter(student => student.name.toLowerCase().includes(name.toLowerCase()));
        if(studentFound.length > 0){
            console.log("Found students:");
            studentFound.forEach(student => {
                console.log(`${student.id}\t${student.name}\t${student.age}\t${student.grade}`);
            });
        }else{
            console.log("No students found with that name.");
        }
    }

    Statistics(){
        const totalStudents = this.students.length;
        const averageGrade = this.students.reduce((sum, student) => sum + parseFloat(student.grade), 0) / totalStudents;
        const excellent = this.students.filter(student => student.grade >= 8).length;
        const good = this.students.filter(student => student.grade >= 6.5 && student.grade < 8).length;
        const average = this.students.filter(student => student.grade < 6.5).length;
        console.log("Statistics:");
        console.log(`Total Students: ${totalStudents}`);
        console.log(`Average Grade: ${averageGrade.toFixed(2)}`);
        console.log(`Excellent (>= 8): ${excellent}`);
        console.log(`Good (>= 6.5 and < 8): ${good}`);
        console.log(`Average (< 6.5): ${average}`);
    }
    
    saveToFile(){
        const fs = require('fs');
        fs.writeFileSync('students.json', JSON.stringify(this.students, null, 2));
        console.log('Student list saved to students.json');
    }

    loadFromFile(filePath){
        if(fs.existsSync(filePath)){
            const data = fs.readFileSync(filePath);
            this.students = JSON.parse(data);
            this.nextId = this.students.length ? this.students[this.students.length - 1].id + 1 : 1;}
        else{
            console.log("File not found. Starting with an empty list.");
        }}
}

class studentUI{
    constructor(mannager){
        this.mannager = mannager;
    }
    displayUI(){
        console.log("\nWelcome to the Student Management System\n");
        rl.question("1. Add Student\n2. Show all student \n3. Search student by name \n4. Statistics \n5. save to file \n6. exit\n",(option)=>
        {
            switch(option){
                case '1':
                    rl.question("Enter name: ", (name) => {
                        rl.question("Enter age: ", (age) => {
                            rl.question("Enter grade: ", (grade) => {
                                this.mannager.addStudent(name, age, grade);
                                this.displayUI();
                            });
                        });
                    });
                    break;
                case '2':
                    this.mannager.showAllStudents();
                    this.displayUI();
                break;
                case '3':
                    rl.question("Enter name to search: " , (name) => {
                        this.mannager.searchStudentByName(name);
                        this.displayUI();})
                break;
                case '4':
                    this.mannager.Statistics();
                    this.displayUI();
                break;
                case '5':
                    this.mannager.saveToFile();
                    this.displayUI();
                break; 
                case '6':
                    console.log("Exiting");
                    rl.close();
                break;
                default:
                    console.log("Invalid option. Please try again.");
                    this.displayUI();
                break;
            }
        })
}}
const studentManagement = new studentManager();
studentManagement.loadFromFile('students.json');
const UI = new studentUI(studentManagement);
UI.displayUI();