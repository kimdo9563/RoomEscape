// ==================================================================================
//
// 20190916 jsRoomEscape.js , 20154638 Kim DoHyeong
//
// ==================================================================================

          /* Function */
// Room-Light initiallize
function initRoomLight(KindOfRoom, light) {
    for (var i in KindOfRoom) {
        KindOfRoom[i].setRoomLight(light)
    }
}

// Arrow
function arrowCreator(KindOfRoom) {
    // room arrow creator
    for (var i in KindOfRoom) {
        KindOfRoom[i].leftArrow = KindOfRoom[i].createObject("leftArrow", "leftArrow.png")
        KindOfRoom[i].leftArrow.setWidth(40)
        KindOfRoom[i].locateObject(KindOfRoom[i].leftArrow, 50, 350)

        KindOfRoom[i].rightArrow = KindOfRoom[i].createObject("rightArrow", "rightArrow.png")
        KindOfRoom[i].rightArrow.setWidth(40)
        KindOfRoom[i].locateObject(KindOfRoom[i].rightArrow, 1220, 350)
    }
}

function arrowOnClick(roomNumber, side) {
    // click arrow, then move the room
    if (side == "left") {
        // 
        CountArrowClick.shift()
        CountArrowClick.push("L")
        try {
            game.move(KindOfRoom[roomNumber - 2])
        } catch(error) {
            game.move(KindOfRoom[KindOfRoom.length - 1])
        }
    }
    else if (side == "right") {
        CountArrowClick.shift()
        CountArrowClick.push("R")

        try {
            game.move(KindOfRoom[roomNumber])
        } catch (error) {
            game.move(KindOfRoom[0])
        }
    }
}

function compareClickCounter(ClickCounterArray) {
    // 화살표 클릭 기록 비교 후, T/F 리턴
    var AnswerArray = ["L", "L", "R", "L", "R", "R", "R", "L", "R", "L"]
    for (var i = 0; i+1 <= 10; i++) {
        if (ClickCounterArray[i] !== AnswerArray[i]) return false
    }
    return true
}


// ==================================================================================
            /* Room Creator */

room1 = game.createRoom("room1", "room1_background.png")  //변수명과 방이름 동일, KindOfRoom 일치해야함
room2 = game.createRoom("room2", "room2_background.png")
room3 = game.createRoom("room3", "room3_background.png")

var KindOfRoom = [room1, room2, room3]  // Room List 입력, 필요 시 수정
var CountArrowClick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

initRoomLight(KindOfRoom, light = 0.4)// 방 밝기 초기화
arrowCreator(KindOfRoom)  // 각 Room마다 Arrow 생성



// ==================================================================================

            /* KindOfRoom[0] = Room 1 */
// Arrow 
KindOfRoom[0].leftArrow.onClick = function () {
    arrowOnClick(1, "left")  // parameter (Room No. , "Direction")
}
KindOfRoom[0].rightArrow.onClick = function () {
    arrowOnClick(1, "right")
}

// switch
KindOfRoom[0].switch = KindOfRoom[0].createObject("switch", "offSwitch.png");
KindOfRoom[0].switch.setWidth(40);
KindOfRoom[0].locateObject(KindOfRoom[0].switch, 1200, 300)
KindOfRoom[0].switch.lock()

KindOfRoom[0].switch.onClose = function () {
    KindOfRoom[0].switch.setSprite("offSwitch.png")
    for (var i in KindOfRoom) {
        KindOfRoom[i].setRoomLight(0.1)
    }
}
KindOfRoom[0].switch.onOpen = function () {
    KindOfRoom[0].switch.setSprite("onSwitch.png")
    for (var i in KindOfRoom) {
        KindOfRoom[i].setRoomLight(0.9)
    }
}

KindOfRoom[0].switch.onClick = function () {
    if (KindOfRoom[0].switch.isLocked()) {
        if (game.getHandItem() == KindOfRoom[0].battery) {
            printMessage("배터리를 갈아볼까..")
            KindOfRoom[0].switch.unlock()
        }
        else printMessage("전원이 끊겨있네.. 배터리를 찾아볼까..")
    }
    else {
        if (KindOfRoom[0].switch.isClosed()) KindOfRoom[0].switch.open()
        else KindOfRoom[0].switch.close()
    }
}

// computer & table
KindOfRoom[0].computer = KindOfRoom[0].createObject("computer", "computertable.png")
KindOfRoom[0].computer.setWidth(400);
KindOfRoom[0].locateObject(KindOfRoom[0].computer, 900, 400)

KindOfRoom[0].computer.onClick = function () {
    if (KindOfRoom[0].computer.isClosed()) {
        printMessage("Scan8282... 빨리빨리..?")
        showImageViewer("logOn.png", "")
    } else if (KindOfRoom[0].computer.isOpened()) {
        if (compareClickCounter(CountArrowClick)) {  //"L", "L", "R", "L", "R", "R", "R", "L", "R", "L"
            KindOfRoom[2].masterKey.show()
            printMessage("쿵 !")
        } else {
            printMessage("무슨 뜻이지..?")
            showImageViewer("webcam.png", "")
        }

    }
}
// Message
KindOfRoom[0].message = KindOfRoom[0].createObject("message", "message.png");
KindOfRoom[0].message.setWidth(40);
KindOfRoom[0].locateObject(KindOfRoom[0].message, 750, 550)

KindOfRoom[0].message.onClick = function () {
    printMessage("..뭐라는거야...")
    showImageViewer("innerMessage.png", "")
}

// battery
KindOfRoom[0].battery = KindOfRoom[0].createObject("battery", "battery.png")
KindOfRoom[0].battery.setWidth(40);
KindOfRoom[0].locateObject(KindOfRoom[0].battery, 500, 600)

KindOfRoom[0].battery.setItemDescription("전원을 넣는데 사용한다.")
KindOfRoom[0].battery.onClick = function () { 
    KindOfRoom[0].battery.pick()
    printMessage("배터리를 주었다!")
}

// Board
KindOfRoom[0].board = KindOfRoom[0].createObject("board", "board.png")
KindOfRoom[0].board.setWidth(350);
KindOfRoom[0].locateObject(KindOfRoom[0].board, 400, 250)

KindOfRoom[0].board.onClick = function () { 
    printMessage("곰이 문이된다고...?")
    showImageViewer("question.png", "")
}

// shape Triangle
KindOfRoom[0].shapeTriangle = KindOfRoom[0].createObject("shapeTriangle", "shapeTriangle.png")
KindOfRoom[0].shapeTriangle.setWidth(40);
KindOfRoom[0].locateObject(KindOfRoom[0].shapeTriangle, 835, 380)

KindOfRoom[0].shapeTriangle.onClick = function () {
    KindOfRoom[0].shapeTriangle.pick()
}

// ==================================================================================

            /* KindOfRoom[1] = Room 2 */
// Arrow
KindOfRoom[1].leftArrow.onClick = function () {
    arrowOnClick(2, "left")
}
KindOfRoom[1].rightArrow.onClick = function () {
    arrowOnClick(2, "right")
}

// shape Heart
KindOfRoom[1].shapeHeart = KindOfRoom[1].createObject("shapeHeart", "shapeHeart.png")
KindOfRoom[1].shapeHeart.setWidth(70);
KindOfRoom[1].locateObject(KindOfRoom[1].shapeHeart, 990, 490)
KindOfRoom[1].shapeHeart.hide()

KindOfRoom[1].shapeHeart.onClick = function () {
    KindOfRoom[1].shapeHeart.pick()
}

// Hammar
KindOfRoom[1].hammar = KindOfRoom[1].createObject("hammar", "hammar.png")
KindOfRoom[1].hammar.setWidth(220);
KindOfRoom[1].locateObject(KindOfRoom[1].hammar, 890, 440)

KindOfRoom[1].hammar.onClick = function () {
    printMessage("어딘가 내려찍고 싶은 해머이다.")
    KindOfRoom[1].hammar.pick()
}

// Insect
function getRandomLocation(min, max) {  // 벌레 위치 랜덤 생성
    var randomLocate = Math.floor(Math.random() * (max - min + 1) + min)
    return randomLocate
}

var ClickCountInsect = 0  // 벌레 클릭한 횟수, 5회면 터짐

KindOfRoom[1].insect = KindOfRoom[1].createObject("insect", "insect.png")
KindOfRoom[1].insect.setWidth(40);
KindOfRoom[1].locateObject(KindOfRoom[1].insect, 800, 510)
KindOfRoom[1].insect.hide()

KindOfRoom[1].insect.onClick = function () {
    if (ClickCountInsect < 5) {
        var randomLocateX = getRandomLocation(300, 900)  //  x = 300 ~ 900
        var randomLocateY = getRandomLocation(500, 700)  // y = 500 ~ 700

        printMessage("벌레가 도망갔다!")
        KindOfRoom[1].locateObject(KindOfRoom[1].insect, randomLocateX, randomLocateY)
        KindOfRoom[1].locateObject(KindOfRoom[1].shapeHeart, randomLocateX, randomLocateY)

        ClickCountInsect += 1
    }
    else if (ClickCountInsect = 5) {
        KindOfRoom[1].insect.hide()
        KindOfRoom[1].shapeHeart.show()
        printMessage("벌레를 터트리니 하트모형이 나왔다!")
    }
}

// Printer
KindOfRoom[1].printer = KindOfRoom[1].createObject("printer", "printer.png")
KindOfRoom[1].printer.setWidth(220);
KindOfRoom[1].locateObject(KindOfRoom[1].printer, 370, 450)

KindOfRoom[1].printer.onClick = function () {

    if (KindOfRoom[0].computer.isClosed()) {
        printMessage("스캔해보았지만 아무 소용이 없다.")
        if (game.getHandItem() == KindOfRoom[1].shapeHeart) {
            printMessage("컴퓨터에서 소리가 난다! 가보자.")
            KindOfRoom[0].computer.open()
        }
    }
}


// Broken wall
KindOfRoom[1].broken = KindOfRoom[1].createObject("broken", "wallUnbroken.png")
KindOfRoom[1].broken.setWidth(50);
KindOfRoom[1].locateObject(KindOfRoom[1].broken, 600, 300)

KindOfRoom[1].broken.onOpen = function () {
    KindOfRoom[1].broken.setSprite("wallBroken.png")
    KindOfRoom[1].shapeStar.show()
}
KindOfRoom[1].broken.onClick = function () {
    printMessage("벽에 금이 있다.. 내려치면 부셔질 것 같은데..?")
    if (game.getHandItem() == KindOfRoom[1].hammar) {
        printMessage("벽이 부서졌다 !")
        KindOfRoom[1].broken.open()
    }
    
}

// shape Star
KindOfRoom[1].shapeStar = KindOfRoom[1].createObject("shapeStar", "shapeStar.png")
KindOfRoom[1].shapeStar.setWidth(30);
KindOfRoom[1].locateObject(KindOfRoom[1].shapeStar, 600, 300)
KindOfRoom[1].shapeStar.hide()

KindOfRoom[1].shapeStar.onClick = function () {
    KindOfRoom[1].shapeStar.pick()
}
// ==================================================================================


            /* KindOfRoom[2] = Room 3 */
// Arrow
KindOfRoom[2].leftArrow.onClick = function () {
    arrowOnClick(3, "left")
}
KindOfRoom[2].rightArrow.onClick = function () {
    arrowOnClick(3, "right")
}

// Locker
KindOfRoom[2].locker = KindOfRoom[2].createObject("locker", "lockerLocked.png")
KindOfRoom[2].locker.setWidth(210);
KindOfRoom[2].locateObject(KindOfRoom[2].locker, 1020, 500)
KindOfRoom[2].locker.lock()

KindOfRoom[2].locker.onOpen = function () {
    KindOfRoom[2].locker.setSprite("lockerUnlocked.png")
    KindOfRoom[1].insect.show()
    printMessage("우왓! 너무 뻑뻑하잖아. 집이 흔들리네..")
}

KindOfRoom[2].locker.onClick = function () {
    if (KindOfRoom[2].locker.isLocked()) {
        showKeypad("number", "8790", function () {
            KindOfRoom[2].locker.unlock()
            printMessage("철커덩")         
        })
    } else if (KindOfRoom[2].locker.isClosed()) {
        KindOfRoom[2].locker.open()
        KindOfRoom[2].shapeCircle.show()
    }
}

// shape Star
KindOfRoom[2].shapeCircle = KindOfRoom[2].createObject("shapeCircle", "shapeCircle.png")
KindOfRoom[2].shapeCircle.setWidth(70);
KindOfRoom[2].locateObject(KindOfRoom[2].shapeCircle, 990, 490)
KindOfRoom[2].shapeCircle.hide()

KindOfRoom[2].shapeCircle.onClick = function () {
    KindOfRoom[2].shapeCircle.pick()
}

// masterKey
KindOfRoom[2].masterKey = KindOfRoom[2].createObject("masterKey", "masterKey.png")
KindOfRoom[2].masterKey.setWidth(100);
KindOfRoom[2].locateObject(KindOfRoom[2].masterKey, 650, 650)
KindOfRoom[2].masterKey.hide()

KindOfRoom[2].masterKey.setItemDescription("설마.. '그' 열쇠..?")
KindOfRoom[2].masterKey.onClick = function () { 
    KindOfRoom[2].masterKey.pick()
    printMessage("청동 문에 걸맞는 열쇠..? 설마..?")
}

// IronDoor
KindOfRoom[2].ironDoor = KindOfRoom[2].createObject("ironDoor", "ironDoorLocked.png")
KindOfRoom[2].ironDoor.setWidth(250);
KindOfRoom[2].locateObject(KindOfRoom[2].ironDoor, 500, 350)
KindOfRoom[2].ironDoor.lock()  

KindOfRoom[2].ironDoor.onOpen = function () {
    KindOfRoom[2].ironDoor.setSprite("ironDoorUnlocked.png")
}

KindOfRoom[2].ironDoor.onClick = function () {
    if (KindOfRoom[2].ironDoor.isLocked()) {
        printMessage("문이 자물쇠로 잠겨있네..")  
        if (game.getHandItem() == KindOfRoom[2].masterKey) {
            printMessage("오.. 자물쇠를 풀었다..!")
            KindOfRoom[2].ironDoor.unlock()
            KindOfRoom[2].ironDoor.open()
        }
    }
    else {
        if (KindOfRoom[2].ironDoor.isOpened()) game.clear()
    }
}
// ==================================================================================

// Initiate Game
game.start(KindOfRoom[0]);  // 최초 시작 시 Room Type
printMessage("어두워서 보이지 않는다... 스위치부터 찾아보자.");  //문구 출력