import exibitions from './exibitions.json' assert { type: 'json' };
import groups from './groups.json' assert { type: 'json' };



import { organizeMatchesByRound, simulateMatch, updateResults } from './groupStage/matchOperations.js';
import { calculatePointDifferenceInRoundRobin, calculateResults } from './groupStage/calculatePoints.js';
import { assignRanks, displayResults, formHats, displayHats} from './ranking/rankingOperations.js';
import { formEliminationPhase, getGroupMatchups, formQuarterFinals, formSemiFinals, formThirdPlaceAndFinalMatch, printMedalists } from './elimination/eliminationOperations.js';

for (const group in groups) {
    const teamList = groups[group];
    const result = {};

  
    for (let i = 0; i < teamList.length; i++) {
        result[teamList[i].ISOCode] = {
            team: teamList[i].Team,
            isoCode: teamList[i].ISOCode,
            points: 0,
            scoredPoints: 0,
            concededPoints: 0,
            wins: 0,
            losses: 0
        };
    }

    const rounds = organizeMatchesByRound(teamList);

    rounds.forEach((matches, roundIndex) => {
        console.log(`Grupna Faza - ${roundIndex + 1} kolo: \n`);
        console.log(`Grupa: ${group}`);

        matches.forEach(([team1, team2]) => {
            const [team1Points, team2Points] = simulateMatch(team1, team2);
            updateResults(team1, team2, team1Points, team2Points, result);
            console.log(`${team1.Team} - ${team2.Team} (${team1Points} : ${team2Points})`);
        });

        console.log('');
    });

    const headToHeadResults = {}; 
    Object.values(result).forEach(team => {
        headToHeadResults[team.isoCode] = {};
        Object.values(result).forEach(opponent => {
            if (team.isoCode !== opponent.isoCode) {
                headToHeadResults[team.isoCode][opponent.isoCode] = {
                    team1Points: team.scoredPoints - team.concededPoints,
                    team2Points: opponent.scoredPoints - opponent.concededPoints
                };
            }
        });
    });

    calculatePointDifferenceInRoundRobin(teamList, headToHeadResults);

    console.log(`Grupa ${group} (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika)`);
    const results = calculateResults(teamList, result);
    results.forEach((team, index) => {
        console.log(`${index + 1}. ${team.team} ${team.wins} / ${team.losses} / ${team.points} / ${team.scoredPoints} / ${team.concededPoints} / ${team.pointDiff}`);
    });

    console.log('------------------------------');
}


const rankedTeams = assignRanks(groups);
displayResults(rankedTeams);    
const hats = formHats(rankedTeams);
displayHats(hats);
const groupStageMatchups = getGroupMatchups(groups);
const eliminationsPhase = formEliminationPhase(hats, groupStageMatchups);
const quarterFinals = formQuarterFinals(eliminationsPhase);
const semiFinals = formSemiFinals(quarterFinals);
const thirdAndFinalPlace = formThirdPlaceAndFinalMatch(semiFinals);
printMedalists(thirdAndFinalPlace);