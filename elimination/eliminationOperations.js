import { simulateMatch } from '../groupStage/matchOperations.js';

export const getGroupMatchups = (groups) => {
    const matchups = [];
    for (const groupName in groups) {
        const teams = groups[groupName];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                matchups.push([teams[i].ISOCode, teams[j].ISOCode]);
            }
        }
    }
    return matchups;
};


export const hasPlayedBefore = (team1, team2, groupMatchups) => {
    return groupMatchups.some(([code1, code2]) => 
        (team1 === code1 && team2 === code2) || 
        (team1 === code2 && team2 === code1)
    );
};



export const formEliminationPhase = (hats, groupStageMatchups) => {
    

    
    const dTeams = hats.hatD;
    const eTeams = hats.hatE;
    const fTeams = hats.hatF;
    const gTeams = hats.hatG;

    const possibleMatchups = [
        { team1: dTeams[0], team2: gTeams[0] },
        { team1: dTeams[1], team2: gTeams[1] }, 
        { team1: eTeams[0], team2: fTeams[0] }, 
        { team1: eTeams[1], team2: fTeams[1] }  
    ];

  
    const validMatchups = possibleMatchups.filter(({ team1, team2 }) => {
        return !hasPlayedBefore(team1.ISOCode, team2.ISOCode, groupStageMatchups);
    });

    
    if (validMatchups.length < 4) {
        const remainingTeams = [...dTeams, ...eTeams, ...fTeams, ...gTeams]
            .filter(team => !validMatchups.some(({ team1, team2 }) => team1.ISOCode === team.ISOCode || team2.ISOCode === team.ISOCode));

        while (validMatchups.length < 4 && remainingTeams.length > 1) {
            const team1 = remainingTeams.shift();
            const team2 = remainingTeams.shift();
            if (!hasPlayedBefore(team1.ISOCode, team2.ISOCode, groupStageMatchups)) {
                validMatchups.push({ team1, team2 });
            }
        }
    }

    console.log("Eliminaciona faza:\n");

    validMatchups.forEach(({ team1, team2 }) => {
        if (team1 && team2) {
            console.log(`${team1.Team} - ${team2.Team}`);
          
        }
    });

    console.log('------------------------------');

    return validMatchups;
};

export const formQuarterFinals = (eliminationsMatchups) => {
    console.log("\nČetvrtfinale:");

    const results = eliminationsMatchups.map(({team1, team2}) => {
        if (team1 && team2) {
            const [team1Score, team2Score] = simulateMatch(team1, team2);
            console.log(`${team1.Team} - ${team2.Team} (${team1Score} : ${team2Score})`);
            return {
                team1,
                team2,
                winner: team1Score > team2Score ? team1 : team2
            };
        }
    }).filter(result => result); 

    return results;
};

export const formSemiFinals = (quarterFinalResults) => {
    if (!quarterFinalResults || quarterFinalResults.length !== 4) {
        throw new Error("Invalid quarter final results");
    }

    
    const dAndGWinners = quarterFinalResults.slice(0, 2).map(result => result.winner);
    const eAndFWinners = quarterFinalResults.slice(2, 4).map(result => result.winner);

    console.log("\nPolufinale:");

    
    const semiFinalResults = [];

    
    const [team1A, team1B] = dAndGWinners;
    const [team1ScoreA, team2ScoreA] = simulateMatch(team1A, team1B);
    semiFinalResults.push({
        teams: [team1A, team1B],
        scores: [team1ScoreA, team2ScoreA],
        winner: team1ScoreA > team2ScoreA ? team1A : team1B,
        loser: team1ScoreA > team2ScoreA ? team1B : team1A
    });
    console.log(`${team1A.Team} - ${team1B.Team} (${team1ScoreA} : ${team2ScoreA})`);

   
    const [team2A, team2B] = eAndFWinners;
    const [team1ScoreB, team2ScoreB] = simulateMatch(team2A, team2B);
    semiFinalResults.push({
        teams: [team2A, team2B],
        scores: [team1ScoreB, team2ScoreB],
        winner: team1ScoreB > team2ScoreB ? team2A : team2B,
        loser: team1ScoreB > team2ScoreB ? team2B : team2A
    });
    console.log(`${team2A.Team} - ${team2B.Team} (${team1ScoreB} : ${team2ScoreB})`);

    return semiFinalResults;
};


export const formThirdPlaceAndFinalMatch = (semiFinalResults) => {
    if (!semiFinalResults || semiFinalResults.length !== 2) {
        throw new Error("Invalid semi finals results");
    }

   
    const [firstSemiFinal, secondSemiFinal] = semiFinalResults;



    const thirdPlaceTeams = [
        { Team: firstSemiFinal.loser.Team, Score: firstSemiFinal.scores[firstSemiFinal.scores[0] < firstSemiFinal.scores[1] ? 0 : 1] },
        { Team: secondSemiFinal.loser.Team, Score: secondSemiFinal.scores[secondSemiFinal.scores[0] < secondSemiFinal.scores[1] ? 0 : 1] } 
    ];
   
  
    const finalPlaceTeams = [
        { Team: firstSemiFinal.winner.Team },
        { Team: secondSemiFinal.winner.Team }
    ];
    const finalTeamsString = finalPlaceTeams.map(team => team.Team).join(" - ");
    console.log("\nFinalisti:");
    console.log(finalTeamsString);


    const [team1Info, team2Info] = thirdPlaceTeams;
    const [team1Score, team2Score] = simulateMatch(team1Info.Team, team2Info.Team);

    console.log("\nUtakmica za treće mesto:");
    console.log(`${team1Info.Team} - ${team2Info.Team} (${team1Score} : ${team2Score})`);
    
  
    console.log("\nFinale:");
    const [finalTeam1, finalTeam2] = finalPlaceTeams;
    const [finalTeam1Score, finalTeam2Score] = simulateMatch(finalTeam1.Team, finalTeam2.Team);
    console.log(`${finalTeam1.Team} - ${finalTeam2.Team} (${finalTeam1Score} : ${finalTeam2Score})`);
    console.log('------------------------------');

    return { 
        team1: { name: team1Info.Team, score: team1Score }, 
        team2: { name: team2Info.Team, score: team2Score },
        final: {
            team1: { name: finalTeam1.Team, score: finalTeam1Score },
            team2: { name: finalTeam2.Team, score: finalTeam2Score }
        }
        
    };
    

   

};

export const printMedalists = (results) => {
    if (!results || !results.final || !results.team1 || !results.team2) {
        throw new Error("Invalid results data");
    }

 
    const goldMedalWinner = results.final.team1.score > results.final.team2.score ? results.final.team1 : results.final.team2;

    const silverMedalWinner = results.final.team1.score > results.final.team2.score ? results.final.team2 : results.final.team1;
   
    const bronzeMedalWinner = results.team1.score > results.team2.score ? results.team1 : results.team2;

  
    const maxLength = Math.max(goldMedalWinner.name.length, silverMedalWinner.name.length, bronzeMedalWinner.name.length);

    console.log("\nMedalje:");
    console.log(`1. ${goldMedalWinner.name.padEnd(maxLength)} 🥇`);
    console.log(`2. ${silverMedalWinner.name.padEnd(maxLength)} 🥈`);
    console.log(`3. ${bronzeMedalWinner.name.padEnd(maxLength)} 🥉`);
};
