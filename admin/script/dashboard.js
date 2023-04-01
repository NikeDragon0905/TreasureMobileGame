var txtTotalUser;
var txtActiveUser;
var txtActivePlayer;
var txtTotalDeposits;
var txtTotalWithdraws;
var txtPendingWithdraws;
var txtAdmins;
var lblUserName;

const firebaseConfig = {
    apiKey: "AIzaSyD2X3uCG2znteFlHnS27bA7DW299WnP5oQ",
    authDomain: "potluck-island.firebaseapp.com",
    databaseURL: "https://potluck-island-default-rtdb.firebaseio.com",
    projectId: "potluck-island",
    storageBucket: "potluck-island.appspot.com",
    messagingSenderId: "125634427374",
    appId: "1:125634427374:web:34608887bb546ccaa2b6ff"
};

function init(){
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }  

    txtTotalUser = document.getElementById('txtTotalUser');
    txtActiveUser = document.getElementById('txtActiveUser');
    txtActivePlayer = document.getElementById('txtActivePlayer');
    txtTotalDeposits = document.getElementById('txtTotalDeposits');
    txtTotalWithdraws = document.getElementById('txtTotalWithdraws');
    txtPendingWithdraws = document.getElementById('txtPendingWithdraws');
    txtAdmins = document.getElementById('txtAdmins');
    lblUserName = document.getElementById('userName');

    txtTotalUser.innerHTML = '0';
    txtActiveUser.innerHTML = '0';
    txtActivePlayer.innerHTML = '0';
    txtTotalDeposits.innerHTML = '0';
    txtTotalWithdraws.innerHTML = '0';
    txtPendingWithdraws.innerHTML = '0';
    txtAdmins.innerHTML = '0';

    var mUser = sessionStorage.getItem('userName');
    lblUserName.innerHTML = mUser;
    
    one();
}

function one(){
    var database = firebase.database();
    var leadsRef = database.ref('users');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            txtTotalUser.innerHTML = snapshot.numChildren();
        }
    });
    two();
}

function two(){
    var database = firebase.database();
    var leadsRef = database.ref('playing');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            txtActivePlayer.innerHTML = snapshot.numChildren();
        }
    });
    three();
}

function three(){
    var database = firebase.database();
    var leadsRef = database.ref('deposits');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            txtTotalDeposits.innerHTML = snapshot.numChildren();
        }
    });
    four();
}

function four(){
    var database = firebase.database();
    var leadsRef = database.ref('withdrawals').child('crypto');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            txtTotalWithdraws.innerHTML = snapshot.numChildren();
        }
    });
    five();
}

function five(){
    var database = firebase.database();
    var leadsRef = database.ref('withdrawals').child('bank');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            txtPendingWithdraws.innerHTML = snapshot.numChildren();
        }
    });
    six();
}

function six(){
    var database = firebase.database();
    var leadsRef = database.ref('admins');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            txtAdmins.innerHTML = snapshot.numChildren();
        }
    });
}

