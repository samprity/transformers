var g_autbots, g_decepticons, g_outcome;
function init() {
    g_autbots= [];
    g_decepticons= [];
    g_outcome = {
        aScore: 0,
        aSurvivors: [],
        dScore:0,
        dSurvivors: [],
        allDestroyed: false,
        batteCount: 0,
    };
}
// clear all global vars
init();

// creates an autobot. takes name from input fill and assigns random criterias
$( "#create-aut" ).click(function() {
    var name = $('input[id="name-aut"]').val();
    var transformer = new Transformer(name, 'A');
    g_autbots.push(transformer);
    $('input[id="name-aut"]').val('');
});

// creates a transformer. takes name from input fill and assigns random criterias
$( "#create-dec" ).click(function() {
    var name = $('input[id="name-dec"]').val();
    var transformer = new Transformer(name, 'D');
    g_decepticons.push(transformer);
    $('input[id="name-dec"]').val('');
});

// transformer class
function Transformer (name, type) {
    this.name = name;
    this.type = type;
    this.strength = Math.floor(Math.random() * 10);
    this.intelligence = Math.floor(Math.random() * 10);
    this.speed = Math.floor(Math.random() * 10);
    this.endurance = Math.floor(Math.random() * 10);
    this.rank = Math.floor(Math.random() * 10);
    this.courage = Math.floor(Math.random() * 10);
    this.firepower = Math.floor(Math.random() * 10);
    this.skill = Math.floor(Math.random() * 10);
    this.rating = this.speed + this.intelligence + this.endurance + this.firepower;
}

// sorts transformers based on rank
function sortBots(bots) {
    return bots.sort(function(a, b){
        return b.rank - a.rank;
    });
}

// handles fight
function startFight(autobot, decepticon) {
    // priority rules
    if ( (autobot.name === 'Optimus Prime' || autobot.name === 'Predaking')
        && (decepticon.name === 'Optimus Prime' || decepticon.name === 'Predaking')) {
        // everyone is destroyed
        g_outcome.allDestroyed = true;
    // either of the transformer is Optimus Prime or Predaking
    } else if ( autobot.name === 'Optimus Prime' && decepticon.name !== 'Predaking') {
        g_outcome.aScore++;
        g_outcome.aSurvivors.push(autobot.name);
    } else if ( autobot.name !== 'Optimus Prime' && decepticon.name === 'Predaking' ) {
        g_outcome.dScore++;
        g_outcome.dSurvivors.push(decepticon.name);
    // courage: runaway survived
    } else if (autobot.courage - decepticon.courage >= 4 && autobot.strength - decepticon.strength >= 3) {
        g_outcome.aScore++;
        g_outcome.aSurvivors.push(autobot.name);
        g_outcome.dSurvivors.push(decepticon.name);
    } else if (decepticon.courage - autobot.courage >= 4 && decepticon.strength - autobot.strength >= 3) {
        g_outcome.dScore++;
        g_outcome.dSurvivors.push(decepticon.name);
        g_outcome.aSurvivors.push(autobot.name);
    // skill
    } else if (autobot.skill - decepticon.skill >= 3) {
        g_outcome.aScore++;
        g_outcome.aSurvivors.push(autobot.name);
    } else if (decepticon.skill - autobot.skill >= 3) {
        g_outcome.dScore++;
        g_outcome.dSurvivors.push(decepticon.name);
    // rating
    } else if (autobot.rating > decepticon.rating) {
        g_outcome.aScore++;
        g_outcome.aSurvivors.push(autobot.name);
    } else if (decepticon.rating > autobot.rating) {
        g_outcome.dScore++;
        g_outcome.dSurvivors.push(decepticon.name);
    } 

}

// Add remaining survivors if both autobots and decepticons number are not equal
function addRemainingSurvivors(count, autobots, decepticons) {
    for (var i = count; i < autobots.length; i++) {
        g_outcome.aSurvivors.push(autobots[i].name);
    }
    for (var i = count; i < decepticons.length; i++) {
        g_outcome.aSurvivors.push(decepticons[i].name);
    }
}

// Result text calculation
function handleResult() {
    if (g_outcome.allDestroyed) {
        alert('All destroyed');
    } else {
        var batte = 'Number of battles: '+ g_outcome.batteCount+ ' ';
        var winningTeam =  g_outcome.aScore > g_outcome.dScore 
        ? '(Autobots) ' + g_outcome.aSurvivors.reduce(function (total, value) {
            return total + value + ' ';
        },'') : '(Decepticons) '+ g_outcome.dSurvivors.reduce(function (total, value) {
            return total + value + ' ';
        },'');
        var losingTeam = g_outcome.aScore > g_outcome.dScore 
        ? '(Decepticons) '+ g_outcome.dSurvivors.reduce(function (total, value) {
            return total + value + ' ';
        },'') : '(Autobots) '+ g_outcome.aSurvivors.reduce(function (total, value) {
            return total + value + ' ';
        },'');
        alert(batte + '\rWinning team: ' + winningTeam + '\rSurvivors from the losing team: ' + losingTeam);
    }
}

// Fight even handler
$('#fight').click(function() {
    // sort transformers based on rank
    var autobots = sortBots(g_autbots);
    var decepticons = sortBots(g_decepticons);
    // use the smaller array length for fights
    var counter = Math.min(autobots.length, decepticons.length);
    for (var i=0; i < counter; i++){
        if (!g_outcome.allDestroyed) {
            // updates battle count
            g_outcome.batteCount++;
            // handles fight scenario between both parties
            startFight(autobots[i], decepticons[i]);
        }
    }
    // add the bots which did not play
    addRemainingSurvivors(counter, g_autbots, g_decepticons);
    // shows result
    handleResult();
});

// run tests on array provided in the question
$('#runtests').click(function() {
    var testAutoBots = [];
    var testDecepticons = [];
    // for ['Soundwave', 'D', 8, 9, 2, 6, 7, 5, 6, 10]
    var d1 = {};
    d1.type = 'D'
    d1.name = 'Soundwave';
    d1.strength = 8;
    d1.intelligence = 9;
    d1.speed = 2;
    d1.endurance = 6;
    d1.rank = 7;
    d1.courage = 5;
    d1.firepower = 6;
    d1.skill = 10;
    d1.rating = d1.speed + d1.intelligence + d1.strength + d1.endurance + d1.firepower;
    testDecepticons.push(d1);
    // for Bluestreak, A, 6,6,7,9,5,2,9,7
    var a1 = {};
    a1.type = 'A'
    a1.name = 'Bluestreak';
    a1.strength = 6;
    a1.intelligence = 6;
    a1.speed = 7;
    a1.endurance = 9;
    a1.rank = 5;
    a1.courage = 2;
    a1.firepower = 9;
    a1.skill = 7;
    a1.rating = a1.speed + a1.intelligence + a1.strength + a1.endurance + a1.firepower;
    testAutoBots.push(a1);
    // for Hubcap: A, 4,4,4,4,4,4,4,4
    var a2 = {};
    a2.type = 'A'
    a2.name = 'Hubcap';
    a2.strength = 4;
    a2.intelligence = 4;
    a2.speed = 4;
    a2.endurance = 4;
    a2.rank = 4;
    a2.courage = 4;
    a2.firepower = 4;
    a2.skill = 4;
    a2.rating = a2.speed + a2.intelligence + a2.strength + a2.endurance + a2.firepower;
    testAutoBots.push(a2);
    var autobots = sortBots(testAutoBots);
    var decepticons = sortBots(testDecepticons);
    var counter = Math.min(autobots.length, decepticons.length);
    for (var i=0; i < counter; i++){
        g_outcome.batteCount++;
        startFight(autobots[i], decepticons[i]);
    }
    addRemainingSurvivors(counter, testAutoBots, testDecepticons);
    handleResult();
    init();

});