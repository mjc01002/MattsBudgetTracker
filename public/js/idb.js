const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

const request = indexedDB.open('budget', 1);


request.onupgradeneeded = function(event) {


    const db = event.target.result;

    db.createObjectStore('budget', { autoIncrement: true });
};

request.onsuccess = function(event) {

    db = event.target.result;
    if (navigator.onLine) {
    }
};

request.onerror = function(event) {
 
    console.log(event.target.errorCode);
};


function saveRecord(record) {

    
    const transaction = db.transaction(['budget'], 'readwrite');
    const  budgetObjectStore = transaction.objectStore('budget');
    budgetObjectStore.add(record);
}

function uploadTransaction() {

    const transaction = db.transaction(['budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('budget');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['budget'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('budget');
                    budgetObjectStore.clear();

                    alert('All saved transactions has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}
window.addEventListener('online', uploadTransaction);