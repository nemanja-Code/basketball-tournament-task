export const calculatePointDifferenceInRoundRobin = (teams, headToHeadResults) => {
    const pointDifferences = {};
    teams.forEach(team => {
        pointDifferences[team.ISOCode] = 0;
    });

    teams.forEach(team1 => {
        teams.forEach(team2 => {
            if (team1.ISOCode !== team2.ISOCode) {
                const result = headToHeadResults[team1.ISOCode] && headToHeadResults[team1.ISOCode][team2.ISOCode];
                if (result) {
                    const difference = result.team1Points - result.team2Points;
                    if (difference > 0) {
                        pointDifferences[team1.ISOCode] += difference;
                    } else {
                        pointDifferences[team2.ISOCode] -= difference;
                    }
                }
            }
        });
    });

    teams.sort((a, b) => {
        return pointDifferences[b.ISOCode] - pointDifferences[a.ISOCode];
    });
};

export const calculateResults = (teamList, result) => {
    return teamList.map(team => {
        const pointDiff = result[team.ISOCode].scoredPoints - result[team.ISOCode].concededPoints;
        return {
            team: team.Team,
            wins: result[team.ISOCode].wins,
            losses: result[team.ISOCode].losses,
            points: result[team.ISOCode].points,
            scoredPoints: result[team.ISOCode].scoredPoints,
            concededPoints: result[team.ISOCode].concededPoints,
            pointDiff: pointDiff > 0 ? `+${pointDiff}` : `${pointDiff}`
        };
    });
};
