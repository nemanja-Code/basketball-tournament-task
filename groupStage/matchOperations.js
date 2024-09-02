import exibitions from '../exibitions.json' assert { type: 'json' };
import groups from '../groups.json' assert { type: 'json' };


export const organizeMatchesByRound = (teamList) => {
    const rounds = [];
    const numTeams = teamList.length;
    const numRounds = numTeams - 1;

    for (let round = 0; round < numRounds; round++) {
        rounds[round] = [];
        for (let i = 0; i < numTeams; i += 2) {
            const team1 = teamList[i];
            const team2 = teamList[i + 1];
            if (team2) {
                rounds[round].push([team1, team2]);
            }
        }
    }

    return rounds;
};

const getExhibitionResult = (team1, team2) => {
    if (exibitions[team1.ISOCode]) {
        const game = exibitions[team1.ISOCode].find(g => g.Opponent === team2.ISOCode);
        if (game) return game.Result.split('-').map(Number);
    }
    return null;
};

const calculateProbability = (team1Ranking, team2Ranking) => {
    const diff = team1Ranking - team2Ranking;
    return 1 / (1 + Math.pow(10, diff / 400));
};

export const simulateMatch = (team1, team2) => {
    const exibitionResult = getExhibitionResult(team1, team2);

    if (exibitionResult) {
        return exibitionResult;
    }

    const probTeam1Win = calculateProbability(team1.FIBARanking, team2.FIBARanking);
    const result = Math.random();

    let team1Score, team2Score;

    if (result < probTeam1Win) {
        team1Score = Math.floor(Math.random() * 20 + 80); 
        team2Score = Math.floor(Math.random() * 15 + 65); 
    } else {
        team1Score = Math.floor(Math.random() * 15 + 65); 
        team2Score = Math.floor(Math.random() * 20 + 80); 
    }

    return [team1Score, team2Score];
};
export const updateResults = (team1, team2, team1Points, team2Points, result, forfeit = false) => {
    if (!result[team1.ISOCode]) {
        result[team1.ISOCode] = {
            team: team1.Team,
            isoCode: team1.ISOCode,
            points: 0,
            scoredPoints: 0,
            concededPoints: 0,
            wins: 0,
            losses: 0
        };
    }
    if (!result[team2.ISOCode]) {
        result[team2.ISOCode] = {
            team: team2.Team,
            isoCode: team2.ISOCode,
            points: 0,
            scoredPoints: 0,
            concededPoints: 0,
            wins: 0,
            losses: 0
        };
    }
    if (forfeit) {
        result[team1.ISOCode].points += 2;
        result[team1.ISOCode].wins += 1;
        result[team2.ISOCode].points += 0;
        result[team2.ISOCode].losses += 1;
    } else {
        if (team1Points > team2Points) {
            result[team1.ISOCode].points += 2; 
            result[team1.ISOCode].wins += 1;
        } else if (team1Points < team2Points) {
            result[team2.ISOCode].points += 2;
            result[team2.ISOCode].wins += 1;
        } else {
            result[team1.ISOCode].points += 1;
            result[team2.ISOCode].points += 1;
        }
    }

    result[team1.ISOCode].scoredPoints += team1Points;
    result[team1.ISOCode].concededPoints += team2Points;
    result[team2.ISOCode].scoredPoints += team2Points;
    result[team2.ISOCode].concededPoints += team1Points;
};
