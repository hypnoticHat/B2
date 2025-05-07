const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const leader = 1;
const coreMembers = [2, 3, 4, 5, 6];
const reserveMembers = [7, 8, 9, 10, 11];
const teams = [];
for(let core of coreMembers){
    for(let member of reserveMembers){
        teams.push([leader, core, member]);
    }
}

function question(promt){
    return new Promise(resolve => rl.question(promt, resolve));
}

function isValidTeam(team, matchingPairs, incompatiblePairs){
    for(const [A, B] of matchingPairs){
        const hasA = team.includes(A);
        const hasB = team.includes(B);
        if(hasA != hasB){
            return false;
        }
    }

    for(const [A, B] of incompatiblePairs){
        if(team.includes(A) && team.includes(B)){
            return false;
        }
    }
    return true;
}

async function askPair(label){
    const pairs = [];
    const total = parseInt(await question(`Enter number of ${label} pairs: `));
    if(isNaN(total) || total < 0|| total > coreMembers.length || total > reserveMembers.length){
        console.log("Invalid number of pairs. Please enter a positive integer.");
        return askPair(label);
    }
    for(let i = 0; i < total; i++){
        const first = await question(`Enter ID of the first member of ${label} pair ${i + 1}: `);
        const second = await question(`Enter ID of the second member of ${label} pair ${i + 1}: `);
        pairs.push([parseInt(first), parseInt(second)]);
    }

    return pairs;
}

async function main(){
    const matchingPairs = await askPair('matching');
    const incompatiblePairs = await askPair('incompatible');

    console.log("\nnumber of teams:", teams.length);
    console.log('\nMatching pairs:', matchingPairs);
    console.log('Incompatible pairs:', incompatiblePairs);
    console.log('\nnumber of valid teams:', teams.filter(team => isValidTeam(team, matchingPairs, incompatiblePairs)).length);
    console.log('\nValid teams:', teams.filter(team => isValidTeam(team, matchingPairs, incompatiblePairs)));
    rl.close();
}
main();