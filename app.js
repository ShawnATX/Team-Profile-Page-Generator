const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");


const checkEmailAddress = (email) => {
    if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/)) {
        return true;
    }
    else {
        return "Please enter a valid email address"
    }
};

const writeTeamPage = (content) => {
    fs.writeFile(outputPath, content, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("Success!");
      });
}


const managerQuestions = [
    {
        type: "input",
        message: "What is your manager's name?",
        name: "managerName"
    },
    {
        type: "input",
        message: "What is your manager's id?",
        name: "managerId"

    },
    {
        type: "input",
        message: "What is your manager's email?",
        name: "managerEmail",
        validate: checkEmailAddress
    },
    {
        type: "input",
        message: "What is your manager's office number?",
        name: "managerOfficeNumber"
    }
];
const engineerQuestions = [
    {
        type: "input",
        message: "What is your engineer's name?",
        name: "engineerName"
    },
    {
        type: "input",
        message: "What is your engineer's id?",
        name: "engineerId"

    },
    {
        type: "input",
        message: "What is your engineer's email?",
        name: "engineerEmail",
        validate: checkEmailAddress
    },
    {
        type: "input",
        message: "What is your engineer's GitHub user?",
        name: "engineerGithub"
    }
];

const internQuestions = [
    {
        type: "input",
        message: "What is your intern's name?",
        name: "internName"
    },
    {
        type: "input",
        message: "What is your intern's id?",
        name: "internId"

    },
    {
        type: "input",
        message: "What is your intern's email?",
        name: "internEmail",
        validate: checkEmailAddress
    },
    {
        type: "input",
        message: "From what school does your intern hail?",
        name: "internSchool"
    }
];

const managerPrompt = async () => {
    const answers = await inquirer.prompt([
        managerQuestions[0],
        managerQuestions[1],
        managerQuestions[2],
        managerQuestions[3]
    ]);
    return answers;
}

const engineerPrompt = async () => {
    const answers = await inquirer.prompt([
        engineerQuestions[0],
        engineerQuestions[1],
        engineerQuestions[2],
        engineerQuestions[3]
    ]);
    return answers;
};

const internPrompt = async () => {
    const answers = await inquirer.prompt([
        internQuestions[0],
        internQuestions[1],
        internQuestions[2],
        internQuestions[3]
    ]);
    return answers;
}

const getUserInput = async () => {
    const teamArr = [];
    let teamFinished = false;
    try {
        let { managerName, managerId, managerEmail, managerOfficeNumber } = await managerPrompt();
        teamArr.push(new Manager(managerName, managerId, managerEmail, managerOfficeNumber));
        while (teamFinished === false) {
            let { nextTeamMember } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'nextTeamMember',
                    message: "Which type of team member would you like to add? (use arrow keys to select)",
                    choices: ["Engineer", "Intern", "My shoestring budget does not allow me to add any additional team members. Why do you think we have interns in the first place?"]
                }
            ]);
            switch (nextTeamMember) {
                case "Engineer":
                    let { engineerName, engineerId, engineerEmail, engineerGithub } = await engineerPrompt();
                    teamArr.push(new Engineer(engineerName, engineerId, engineerEmail, engineerGithub));
                    break;
                case "Intern":
                    let { internName, internId, internEmail, internSchool } = await internPrompt();
                    teamArr.push(new Intern(internName, internId, internEmail, internSchool));
                    break;
                default:
                    teamFinished = true;
                    const newTeamPage = render(teamArr);
                    writeTeamPage(newTeamPage);
                    console.log("Team page created!");
                    break;
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

getUserInput();


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
