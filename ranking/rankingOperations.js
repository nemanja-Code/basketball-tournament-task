const rankTeams = (teams) => {
    teams.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        } else if (b.pointDifference !== a.pointDifference) {
            return b.pointDifference - a.pointDifference;
        } else {
            return b.scoredPoints - a.scoredPoints;
        }
    });

    return teams;
};

export const assignRanks = (groups) => {
    const rankedTeams = [];

    const firstPlaceTeams = [];
    const secondPlaceTeams = [];
    const thridPlaceTeams = [];

    for(const group in groups){
        const [first, second, third] = rankTeams(groups[group]);

        firstPlaceTeams.push(first);
        secondPlaceTeams.push(second);
        thridPlaceTeams.push(third);
    }
    const rankedFirstPlace = rankTeams(firstPlaceTeams);
    const rankedSecondPlace = rankTeams(secondPlaceTeams);
    const rankedThirdPlace = rankTeams(thridPlaceTeams);

    rankedTeams.push(...rankedFirstPlace, ...rankedSecondPlace, ...rankedThirdPlace);

    return rankedTeams;
};

export const displayResults = (rankedTeams) => {
    console.log("Prvoplasirani timovi: ");
    rankedTeams.slice(0, 3).forEach((team, index) => {
        console.log(`${index + 1}. ${team.Team}`);
    });

    console.log("\nDrugoplasirani timovi: ");
    rankedTeams.slice(3, 6).forEach((team, index) => {
        console.log(`${index + 4}. ${team.Team}`);
    });

    console.log("\nTrećeplasirani timovi: ");
    rankedTeams.slice(6, 9).forEach((team, index) => {
        console.log(`${index + 7}. ${team.Team}`);
    });

    if (rankedTeams.length > 8) {
        console.log(`\nTim sa rangom 9 koja ne prolazi dalje: ${rankedTeams[8].Team}`);
    } else {
        console.log('Došlo je do greške! Nema dovoljno timova.');
    }


    console.log('------------------------------');
}


export const formHats = (teams) => {
    const rankedTeams = rankTeams(teams);

    
    const hatD = [];
    const hatE = [];
    const hatF = [];
    const hatG = [];

   
    rankedTeams.forEach((team, index) => {
        if (index < 2) {
            hatD.push(team);
        } else if (index < 4) {
            hatE.push(team);
        } else if (index < 6) {
            hatF.push(team);
        } else if (index < 8) {
            hatG.push(team);
        }
    });

    
    if (hatD.length < 2) {
        console.error('Nedovoljan broj timova u šeširu D');
    }
    if (hatE.length < 2) {
        console.error('Nedovoljan broj timova u šeširu E');
    }
    if (hatF.length < 2) {
        console.error('Nedovoljan broj timova u šeširu F');
    }
    if (hatG.length < 2) {
        console.error('Nedovoljan broj timova u šeširu G');
    }


    return { hatD, hatE, hatF, hatG };
};

export const displayHats = (hats) => {
    console.log("Šeširi: \n");

    console.log("Šešir D:");
    hats.hatD.forEach((team) => {
        console.log(`${team.Team}`);
    });

    console.log("\nŠešir E:");
    hats.hatE.forEach((team) => {
        console.log(`${team.Team}`);
    });

    console.log("\nŠešir F:");
    hats.hatF.forEach((team) => {
        console.log(`${team.Team}`);
    });

    console.log("\nŠešir G:");
    hats.hatG.forEach((team) => {
        console.log(`${team.Team}`);
    });

    console.log("");
};