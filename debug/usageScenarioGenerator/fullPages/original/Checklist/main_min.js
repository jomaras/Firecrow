var checklistApp = {
    getAllItems: function () {
        var checklist, myArray, completed, total, listlength, item;
        checklist = "";
        myArray = [];
        completed = 0;
        total = 0;
        listlength = localStorage.length - 1;
        for (var i = 0; i <= listlength; i++) {
            item = localStorage.key(i);
            myArray.push(item)
        }
        myArray.sort();
        for (var j = 0; j <= listlength; j++) {
            var sorteditem = myArray[j];
            if (sorteditem !== 'inputvalue') {
                if (localStorage.getItem(sorteditem) === '1') {
                    checklist += '<li role="listitem"><input type="checkbox" checked/><label class="done">' + sorteditem + '</label><span class="delete">&times;</span></li>';
                    completed++;
                    total++
                } else if (localStorage.getItem(sorteditem) === '0') {
                    checklist += '<li role="listitem"><input type="checkbox" /><label>' + sorteditem + '</label><span class="delete">&times;</span></li>';
                    total++
                }
            } else {
                document.querySelector('#name').value = localStorage.getItem(sorteditem)
            }
        }
        if (checklist === "") {
            checklist = '<li role="listitem" class="empty">List empty</li>'
        }
        document.querySelector('#remaining').innerHTML = total - completed;
        document.querySelector('#total').innerHTML = total;
        if (completed === total) {
            document.querySelector('#maillist').style.display = 'none'
        }
        document.querySelector('#checklist').innerHTML = checklist;
        document.querySelector('#checklist').lastChild.style.border = '0'
    },
    eventDelegation: function () {
        var listitems = document.querySelector('#checklist');
        listitems.onclick = function (e) {
            var event = e,
                target = event.target;
            if (target.tagName.toLowerCase() === 'label') {
                var name = target.innerHTML,
                    data;
                if (target.previousSibling.checked) {
                    data = 0
                } else {
                    data = 1
                }
                try {
                    localStorage.setItem(name, data)
                } catch (e) {
                    if (e == QUOTA_EXCEEDED_ERR) {
                        alert('Quota exceeded!')
                    }
                }
                checklistApp.getAllItems()
            } else if (target.tagName.toLowerCase() === 'input') {
                var name = target.nextSibling.innerHTML,
                    data;
                if (target.checked) {
                    data = 1
                } else {
                    data = 0
                }
                try {
                    localStorage.setItem(name, data)
                } catch (e) {
                    if (e == QUOTA_EXCEEDED_ERR) {
                        alert('Quota exceeded!')
                    }
                }
                checklistApp.getAllItems()
            } else if (target.tagName.toLowerCase() === 'span') {
                var name = target.previousSibling.innerHTML;
                if (!confirm("Delete item: " + name + "?")) {
                    return
                }
                localStorage.removeItem(name);
                checklistApp.getAllItems()
            }
        }
    },
    addNewItem: function () {
        var name, data;
        name = document.querySelector('#name').value;
        data = 0;
        strippedString = name.replace(/(<([^>]+)>)/ig, "");
        strippedString = strippedString.replace(/&/, "&amp;");
        strippedString = strippedString.replace(/</, "&lt;");
        strippedString = strippedString.replace(/>/, "&gt;");
        if (strippedString !== "") {
            try {
                localStorage.setItem(strippedString, data)
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!')
                }
            }
            document.querySelector('#name').value = "";
            localStorage.removeItem('inputvalue');
            checklistApp.getAllItems()
        } else {
            alert('Nothing to add!')
        }
    },
    deleteChecked: function () {
        if (!confirm("Delete checked items?")) {
            return
        }
        var i = 0;
        while (i <= localStorage.length - 1) {
            var key = localStorage.key(i);
            if (localStorage.getItem(key) === '1') {
                localStorage.removeItem(key)
            } else {
                i++
            }
        }
        checklistApp.getAllItems()
    },
    deleteAll: function () {
        if (!confirm("Delete all items?")) {
            return
        }
        localStorage.clear();
        checklistApp.getAllItems()
    },
    updateMail: function () {
        document.querySelector('#maillink').href = '';
        var mail, subject, list, length, key;
        mail = 'mailto:?';
        subject = 'List';
        list = '';
        length = localStorage.length;
        key = 0;
        if (length !== 0) {
            for (i = 0; i <= length - 1; i++) {
                key = localStorage.key(i);
                if (localStorage.getItem(key) === '0') {
                    list += localStorage.key(i) + '\n'
                }
            }
            if (list !== '') {
                mail += 'subject=' + encodeURIComponent(subject);
                mail += '&body=' + encodeURIComponent(list);
                document.querySelector('#maillink').href = mail
            }
        }
    },
    sendMail: function () {
        var remaining, maillist;
        remaining = document.querySelector('#remaining').innerHTML;
        maillist = document.querySelector('#maillist');
        if (remaining !== '0') {
            checklistApp.updateMail();
            maillist.style.display === 'none' ? maillist.style.display = 'block' : maillist.style.display = 'none'
        } else {
            alert("You have no items to mail!")
        }
    },
    storeInput: function () {
        localStorage.setItem('inputvalue', this.value)
    }
};

function loaded() {
    window.scrollTo(0, 0);
    if (typeof (localStorage) == 'undefined') {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.')
    } else {
        document.querySelector('#maillist').style.display = 'none';
        checklistApp.getAllItems();
        checklistApp.eventDelegation();
        document.querySelector('#name').addEventListener('keyup', checklistApp.storeInput, false);
        document.querySelector('#deleteall').addEventListener('click', checklistApp.deleteAll, false);
        document.querySelector('#deletechecked').addEventListener('click', checklistApp.deleteChecked, false);
        document.querySelector('#sendmail').addEventListener('click', checklistApp.sendMail, false);
        document.querySelector('#add').addEventListener('click', checklistApp.addNewItem, false)
    }
}
window.addEventListener("load", loaded, true);