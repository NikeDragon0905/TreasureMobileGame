var txtAdminName;
var slAdminRole;
var txtAdminEmail;
var txtAdminPassword;
var btnInsert;

var myTable;

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

    txtAdminName = document.getElementById('txtAdminName');
    slAdminRole = document.getElementById('slAdminRole');
    txtAdminEmail = document.getElementById('txtAdminEmail');
    txtAdminPassword = document.getElementById('txtAdminPassword');
    btnInsert = document.getElementById('btnInsert');

    myTable = document.getElementById('myTable');

    btnInsert.onclick = function(){
        insertAdmin(txtAdminName.value, 
            slAdminRole.options[slAdminRole.selectedIndex].value,
            txtAdminEmail.value, txtAdminPassword.value);
    }
    document.getElementById('msb').click();
    fetchData();
}

function insertAdmin(adminName, adminRole, adminEmail, adminPassword){
    var database = firebase.database();
    var dataRef = database.ref('admins');

    var userKey = dataRef.push().key;
    dataRef.child(userKey).set({
        userKey: userKey,
        adminName: adminName,
        adminRole: adminRole,
        adminEmail: adminEmail,
        adminPassword: adminPassword
    }, function(error){
        alert('New Admin ' + adminName + ' added');
        txtAdminName.value = '';
        txtAdminEmail.value = '';
        txtAdminPassword.value = '';
        slAdminRole.selectedIndex = 0;
        fetchData();
    });
}

function fetchData(){
    myTable.innerHTML = '';
    var userID = 1;

    var database = firebase.database();
    var leadsRef = database.ref('admins');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot) {
                var adminName = childSnapshot.child('adminName').val();
                var adminRole = childSnapshot.child('adminRole').val();
                var adminEmail = childSnapshot.child('adminEmail').val();
                var adminPassword = childSnapshot.child('adminPassword').val();
                var userKey = childSnapshot.child('userKey').val();

                addRow(userID, adminName, adminRole, adminEmail, adminPassword, userKey);
                userID++;
            });
        }
    });
}

function addRow(userID, userName, userEmail, userPassword, userBalance, userKey){
    var row = document.createElement('tr');

    var mID = document.createElement('td');
    mID.innerHTML = userID;

    var mName = document.createElement('td');
    mName.innerHTML = userName;
    
    var mEmail = document.createElement('td');
    mEmail.innerHTML = userEmail;

    var mPass = document.createElement('td');
    mPass.innerHTML = userPassword;

    var mBalance = document.createElement('td');
    mBalance.innerHTML = userBalance;

    var mDelete = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.id = 'dltButton';
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = function(){
        var confirm = window.confirm('Are you sure about deleting this user ?');
        if(confirm){
            var database = firebase.database();
            var pathRef = database.ref('admins').child(userKey);
            pathRef.remove();
            alert('User : ' + userName + ' has been deleted from the server');
            fetchData();
        }
    }

    mDelete.append(deleteButton);

    row.append(mID);
    row.append(mName);
    row.append(mEmail);
    row.append(mPass);
    row.append(mBalance);
    row.append(mDelete);

    myTable.append(row);
}