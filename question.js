var dataurl = "https://jsonbin.org/yinchengchen/plasm";
fetch('https://api.jsonbin.io/b/5ed9f78c655d87580c443b75', {
    headers: {
        "secret-key": '$2b$10$Zk61rj6afq40ft7wTAfRj.Xagrp3DKcML/QNyEHurtvhxFSeXRp4S',
    }
}).then(res => res.json()).then(res => {

    //console.log(res);
    var data = res.data;
    /* initialize */
    // set chapter range
    var chapterList = new Set();
    var repeatList = new Set();
    data.forEach(element => {
        chapterList.has(element.chapter) ? repeatList.add(element.chapter) : chapterList.add(element.chapter);
    });
    // create option
    setChapterList(chapterList);

    /*Event*/
    // go to selection page
    var newGameButton = document.getElementById("new-game");
    newGameButton.addEventListener("click", event => {
        console.log("event", event);
        // close main page and set selection page
        var mainpage = document.getElementById("main-page");
        mainpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center d-none");
        var selectionpage = document.getElementById("selection-page");
        selectionpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center");
    }, false);
    // go to the test page
    var startOption = document.getElementById("start-chapter");
    var endOption = document.getElementById("end-chapter");
    var numberInput = document.getElementById("question-number");
    var testButton = document.getElementById("test-start");
    testButton.addEventListener("click", event => {
        console.log("start ", startOption.value, "end ", endOption.value, numberInput.value);
        var selectionpage = document.getElementById("selection-page");
        selectionpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center d-none");
        var testpage = document.getElementById("test-page");
        testpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center");
        setTestList(data, parseInt(startOption.value), parseInt(endOption.value), parseInt(numberInput.value));
    });
});

// get Random list
function setTestList(data, startChapter, endChapter, number) {
    var selectionList = data.filter((element) => {
        return element.chapter >= startChapter && element.chapter <= endChapter;
    });
    //console.log(selectionList);
    var numberList = Object.values(selectionList).map(item => item.number);
    // get Random number
    var randomList = getArrayItems(numberList, 4);
    //console.log('Random: ', randomList, typeof(randomList));
    var questionList = Object.values(selectionList).filter(function (item, index, array) {
        //console.log(item, index);
        //console.log(randomList.indexOf(item.number));
        if (randomList.indexOf(item.number) >= 0) {
            return item;
        }
    });
    //console.log(questionList);
    var orderList = [1, 2, 3, 4];
    var order = getArrayItems(orderList, 1);
    //console.log(order);
    // Create test view
    displayTest(order, questionList);


}
// Get the chapter list
function setChapterList(data) {
    var startInput = document.getElementById("start-chapter");
    var endInput = document.getElementById("end-chapter");
    data.forEach(element => {
        var option = document.createElement("OPTION");
        option.setAttribute("value", element);
        option.textContent = element;
        startInput.appendChild(option);
    });
    data.forEach(element => {
        var option = document.createElement("OPTION");
        option.setAttribute("value", element);
        option.textContent = element;
        endInput.appendChild(option);
    });
}
function getArrayItems(arr, num) {
    //新建一個陣列,將傳入的陣列複製過來,用於運算,而不要直接操作傳入的陣列;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的數值項,儲存在此陣列
    var return_array = new Array();
    for (var i = 0; i < num; i++) {
        //判斷如果陣列還有可以取出的元素,以防下標越界
        if (temp_array.length > 0) {
            //在陣列中產生一個隨機索引
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            //將此隨機索引的對應的陣列元素值複製出來
            return_array[i] = temp_array[arrIndex];
            //然後刪掉此索引的陣列元素,這時候temp_array變為新的陣列
            temp_array.splice(arrIndex, 1);
        } else {
            //陣列中資料項取完後,退出迴圈,比如陣列本來只有10項,但要求取出20項.
            break;
        }
    }
    return return_array;
}
function setCountTimer() {
    // set TIMER
    var start = true;     // flags that you want the countdown to start
    var stopIn = 10000;    // how long the timer should run
    var stopTime = 0;     // used to hold the stop time
    var stop = false;     // flag to indicate that stop time has been reached
    var timeTillStop = 0; // holds the display time
    function update(timer) {
        var ptext = document.getElementById("timer");
        if (start) {  // do we need to start the timer
            stopTime = timer + stopIn; // yes the set the stoptime
            start = false;             // clear the start flag
        } else {                         // waiting for stop
            if (timer >= stopTime) {     // has stop time been reached?
                stop = true;           // yes the flag to stop
            }
        }
        timeTillStop = stopTime - timer;      // for display of time till stop
        // log() should be whatever you use to display the time.
        console.log(Math.floor(timeTillStop / 1000));  // to display in 1/100th seconds
        ptext.textContent = Math.floor(timeTillStop / 1000) + 1;
        //element.style.transform = 'translateX(' + Math.min(timeTillStop / 1000, 10) + 'px)';
        if (!stop) {
            requestAnimationFrame(update); // continue animation until stop
        }
    }

    requestAnimationFrame(update);  // start the animation
}

function displayTest(order, data) {
    console.log("type:", order);
    order = order - 1;
    // Set question
    var questionView = document.getElementById("question-title");
    var verseView = document.querySelectorAll(".verse-view");
    questionView.textContent = data[order].question;
    verseView[1].textContent = data[order].chapter + ":" + data[order].verse;
    // Set answer
    var answerViews = document.querySelectorAll(".answer-option");
    console.log("lsit: ", answerViews);
    answerViews.forEach(function (item, index) {
        if (index === order) {
            item.textContent = data[order].answer;
        } else {
            item.textContent = data[index].answer;
        }
    });
    setCountTimer();
}