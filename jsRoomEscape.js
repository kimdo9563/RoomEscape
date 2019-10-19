// ==================================================================================
//
//                      20190916 jsRoomEscape.js
//                      20154638 Kim DoHyeong
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
        } catch (error) {
            game.move(KindOfRoom[KindOfRoom.length - 1])
        }
    }
    else if (side == "right") {
        CountArrowClick.shift()
        CountArrowClick.push("R")

        try {
            game.move(KindOfRoom[roomNumber])
        } catch (error) {
            game.move(room1)
        }
    }
}

function compareClickCounter(ClickCounterArray) {
    // 화살표 클릭 기록 비교 후, T/F 리턴
    var AnswerArray = ["L", "L", "R", "L", "R", "R", "R", "L", "R", "L"]
    for (var i = 0; i + 1 <= 10; i++) {
        if (ClickCounterArray[i] !== AnswerArray[i]) return false
    }
    return true
}

/*
function sleep(milliseconds) {
    // pause 기능
    var start = new Date().getTime()
    for (var i = 0; i < 1e7; i++) {  // 1e7 = 10 ^ 7
        if ((new Date().getTime() - start) > milliseconds) { break }
    }
}
*/

// ==================================================================================
/* Room Creator */

room1 = game.createRoom("room1", "room1_background.png")  //변수명과 방이름 동일, KindOfRoom 일치해야함
room2 = game.createRoom("room2", "room2_background.png")
room3 = game.createRoom("room3", "room3_background.png")
print = game.createRoom("print",  "print_background.png")

var KindOfRoom = [room1, room2, room3]  // Room List 입력, 화살표로 움직일 방만 추가
var CountArrowClick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

initRoomLight(KindOfRoom, light = 0.1)// 방 밝기 초기화
arrowCreator(KindOfRoom)  // 각 방마다 Arrow 생성



// ==================================================================================

/* room1 */
// Arrow 
room1.leftArrow.onClick = function () {
    arrowOnClick(1, "left")  // parameter (Room No. , "Direction")
}
room1.rightArrow.onClick = function () {
    arrowOnClick(1, "right")
}

// switch
room1.switch = room1.createObject("switch", "offSwitch.png");
room1.switch.setWidth(40);
room1.locateObject(room1.switch, 1200, 300)
room1.switch.lock()

room1.switch.onClose = function () {
    room1.switch.setSprite("offSwitch.png")
    for (var i in KindOfRoom) {
        KindOfRoom[i].setRoomLight(0.1)
    }
}
room1.switch.onOpen = function () {
    room1.switch.setSprite("onSwitch.png")
    for (var i in KindOfRoom) {
        KindOfRoom[i].setRoomLight(0.9)
    }
}

room1.switch.onClick = function () {
    playSound("switch.wav")
    if (room1.switch.isLocked()) {
        if (game.getHandItem() == room1.battery) {
            printMessage("배터리를 갈아볼까..")
            room1.switch.unlock()
        }
        else printMessage("전원이 끊겨있네.. 배터리를 찾아볼까..")
    }
    else {
        if (room1.switch.isClosed()) room1.switch.open()
        else room1.switch.close()
    }
}

// computer & table
room1.computer = room1.createObject("computer", "computertable.png")
room1.computer.setWidth(400);
room1.locateObject(room1.computer, 900, 400)
room1.computer.lock()

room1.computer.onClick = function () {
    if (room1.computer.isLocked()) {
        printMessage("Scan8282... 빨리빨리..?")
        showImageViewer("logOn.png", "")
    }
    else if (room1.computer.isClosed()) {
        showKeypad("alphabet", "ISEEU", function () {
            room1.computer.open()
            printMessage("로그인되었다 !")
        })
    }
    else if (room1.computer.isOpened()) {
        if (compareClickCounter(CountArrowClick)) {  //"L", "L", "R", "L", "R", "R", "R", "L", "R", "L"
            room3.masterKey.show()
            playSound("boom.wav")
            printMessage("쿵 !")
        } else {
            printMessage("무슨 뜻이지..?")
            showImageViewer("webcam.png", "")
        }

    }
}
// Message
room1.message = room1.createObject("message", "message.png");
room1.message.setWidth(40);
room1.locateObject(room1.message, 750, 550)

room1.message.onClick = function () {
    printMessage("..뭐라는거야...")
    showImageViewer("innerMessage.png", "")
}

// battery
room1.battery = room1.createObject("battery", "battery.png")
room1.battery.setWidth(40);
room1.locateObject(room1.battery, 500, 600)

room1.battery.setItemDescription("전원을 넣는데 사용한다.")
room1.battery.onClick = function () {
    room1.battery.pick()
    printMessage("배터리를 주었다!")
}

// Board
room1.board = room1.createObject("board", "board.png")
room1.board.setWidth(350);
room1.locateObject(room1.board, 400, 250)

room1.board.onClick = function () {
    printMessage("곰이 문이된다고...?")
    showImageViewer("question.png", "")
}

// shape Triangle
room1.shapeTriangle = room1.createObject("shapeTriangle", "shapeTriangle.png")
room1.shapeTriangle.setWidth(40);
room1.locateObject(room1.shapeTriangle, 835, 380)

room1.shapeTriangle.onClick = function () {
    room1.shapeTriangle.pick()
}

// BGM Speaker

room1.speaker = room1.createObject("speaker", "speaker.png")
room1.speaker.setWidth(40);
room1.locateObject(room1.speaker, 1025, 465)
room1.speaker.open()

room1.speaker.onOpen = function () {
    playSound("bgm.wav")
}

room1.speaker.onClick = function () {
    if (room1.speaker.isClosed()) {
        room1.speaker.open()

    } else {
        room1.speaker.close()
        playSound("empty.wav")
    }
}

// ==================================================================================

/* room2 */
// Arrow
room2.leftArrow.onClick = function () {
    arrowOnClick(2, "left")
}
room2.rightArrow.onClick = function () {
    arrowOnClick(2, "right")
}

// shape Heart
room2.shapeHeart = room2.createObject("shapeHeart", "shapeHeart.png")
room2.shapeHeart.setWidth(50);
room2.locateObject(room2.shapeHeart, 990, 490)
room2.shapeHeart.hide()

room2.shapeHeart.onClick = function () {
    room2.shapeHeart.pick()
}

// Hammar
room2.hammar = room2.createObject("hammar", "hammar.png")
room2.hammar.setWidth(220);
room2.locateObject(room2.hammar, 890, 440)

room2.hammar.onClick = function () {
    printMessage("어딘가 내려찍고 싶은 해머이다.")
    room2.hammar.pick()
}

// Insect
function getRandomLocation(min, max) {  // 벌레 위치 랜덤 생성
    var randomLocate = Math.floor(Math.random() * (max - min + 1) + min)
    return randomLocate
}

var ClickCountInsect = 0  // 벌레 클릭한 횟수, 5회면 터짐

room2.insect = room2.createObject("insect", "insect.png")
room2.insect.setWidth(40);
room2.locateObject(room2.insect, 800, 510)
room2.insect.hide()

room2.insect.onClick = function () {
    if (ClickCountInsect < 5) {
        var randomLocateX = getRandomLocation(450, 900)  //  x = 450 ~ 900
        var randomLocateY = getRandomLocation(500, 700)  // y = 500 ~ 700

        printMessage("벌레가 도망갔다!")

        room2.locateObject(room2.insect, randomLocateX, randomLocateY)
        room2.locateObject(room2.shapeHeart, randomLocateX, randomLocateY)

        ClickCountInsect += 1
    }
    else if (ClickCountInsect = 5) {
        room2.insect.hide()
        room2.shapeHeart.show()
        printMessage("벌레를 터트리니 하트모형이 나왔다!")
    }
}


// Broken wall
room2.broken = room2.createObject("broken", "wallUnbroken.png")
room2.broken.setWidth(50);
room2.locateObject(room2.broken, 600, 300)

room2.broken.onOpen = function () {
    room2.broken.setSprite("wallBroken.png")
    room2.shapeStar.show()
}
room2.broken.onClick = function () {
    printMessage("벽에 금이 있다.. 내려치면 부셔질 것 같은데..?")
    if (game.getHandItem() == room2.hammar) {
        playSound("boom.wav")
        printMessage("벽이 부서졌다 !")
        room2.broken.open()
    }

}

// shape Star
room2.shapeStar = room2.createObject("shapeStar", "shapeStar.png")
room2.shapeStar.setWidth(30);
room2.locateObject(room2.shapeStar, 600, 300)
room2.shapeStar.hide()

room2.shapeStar.onClick = function () {
    room2.shapeStar.pick()
}

// Printer
room2.printer = room2.createObject("printer", "printer.png")
room2.printer.setWidth(220);
room2.locateObject(room2.printer, 370, 450)

room2.printer.onClick = function () {
    if (!room1.computer.isOpened()) {
        game.move(print)
    } else printMessage("이제 더 이상 쓸 일이 없을 것 같다.")
}


/* print_room */
print.downArrow = print.createObject("downArrow", "downArrow.png")
print.downArrow.setWidth(40);
print.locateObject(print.downArrow, 630, 670)

print.downArrow.onClick = function () {
    game.move(room2)
}

print.hint = print.createObject("hint", "iseeu.png")
print.hint.setWidth(420);
print.locateObject(print.hint, 630, 185)
print.hint.hide()

print.scanner_space = print.createObject("scanner_space", "scanner_space.png")
print.scanner_space.setWidth(600);
print.locateObject(print.scanner_space, 630, 420)

print.scanner_space1 = print.createObject("scanner_space1", "scanner_space1.png")
print.scanner_space1.setWidth(50);
print.locateObject(print.scanner_space1, 450, 420)

print.scanner_space2 = print.createObject("scanner_space2", "scanner_space1.png")
print.scanner_space2.setWidth(50);
print.locateObject(print.scanner_space2, 580, 420)
print.scanner_space2.lock()

print.scanner_space3 = print.createObject("scanner_space3", "scanner_space1.png")
print.scanner_space3.setWidth(50);
print.locateObject(print.scanner_space3, 710, 420)
print.scanner_space3.lock()

print.scanner_space4 = print.createObject("scanner_space4", "scanner_space1.png")
print.scanner_space4.setWidth(50);
print.locateObject(print.scanner_space4, 840, 420)
print.scanner_space4.lock()

print.scanner_space.onClick = function () {
    if (game.getHandItem() == room1.shapeTriangle) {
        print.scanner_space1.setSprite("shapeTriangle.png")
        print.scanner_space2.unlock()
    }
    if (print.scanner_space2.isClosed()) {
        if (game.getHandItem() == room3.shapeCircle) {
            print.scanner_space2.setSprite("shapeCircle.png")
            print.scanner_space3.unlock()
        }
    }
    if (print.scanner_space3.isClosed()) {
        if (game.getHandItem() == room2.shapeStar) {
            print.scanner_space3.setSprite("shapeStar.png")
            print.scanner_space4.unlock()
        }
    }
    if (print.scanner_space4.isClosed()) {
        if (game.getHandItem() == room2.shapeHeart) {
            print.scanner_space4.setSprite("shapeHeart.png")
            playSound("scanning.wav")
            room1.computer.unlock()
            print.hint.show()
            printMessage("...섬뜩하잖아...")
        }
    }
}


// ==================================================================================


/* room3 */
// Arrow
room3.leftArrow.onClick = function () {
    arrowOnClick(3, "left")
}
room3.rightArrow.onClick = function () {
    arrowOnClick(3, "right")
}

// Locker
room3.locker = room3.createObject("locker", "lockerLocked.png")
room3.locker.setWidth(210);
room3.locateObject(room3.locker, 1020, 500)
room3.locker.lock()

room3.locker.onOpen = function () {
    room3.locker.setSprite("lockerUnlocked.png")
    room2.insect.show()
    playSound("insect.wav")
    printMessage("우왓! 벌레가 튀어나와 사라졌다 !")
}

room3.locker.onClick = function () {
    if (room3.locker.isLocked()) {
        showKeypad("number", "8790", function () {
            room3.locker.unlock()
            printMessage("철커덩")
        })
    } else if (room3.locker.isClosed()) {
        room3.locker.open()
        room3.shapeCircle.show()
    }
}

// shape Star
room3.shapeCircle = room3.createObject("shapeCircle", "shapeCircle.png")
room3.shapeCircle.setWidth(50);
room3.locateObject(room3.shapeCircle, 990, 490)
room3.shapeCircle.hide()

room3.shapeCircle.onClick = function () {
    room3.shapeCircle.pick()
}

// masterKey
room3.masterKey = room3.createObject("masterKey", "masterKey.png")
room3.masterKey.setWidth(100);
room3.locateObject(room3.masterKey, 650, 650)
room3.masterKey.hide()

room3.masterKey.setItemDescription("설마.. '그' 열쇠..?")
room3.masterKey.onClick = function () {
    room3.masterKey.pick()
    printMessage("청동 문에 걸맞는 열쇠..? 설마..?")
}

// IronDoor
room3.ironDoor = room3.createObject("ironDoor", "ironDoorLocked.png")
room3.ironDoor.setWidth(250);
room3.locateObject(room3.ironDoor, 500, 350)
room3.ironDoor.lock()

room3.ironDoor.onOpen = function () {
    room3.ironDoor.setSprite("ironDoorUnlocked.png")
}

room3.ironDoor.onClick = function () {
    if (room3.ironDoor.isLocked()) {
        printMessage("문이 자물쇠로 잠겨있네..")
        if (game.getHandItem() == room3.masterKey) {
            printMessage("오.. 자물쇠를 풀었다..!")
            playSound("unlock.wav")
            room3.ironDoor.unlock()
            room3.ironDoor.open()

        }
    }
    else {
        if (room3.ironDoor.isOpened()) {
            printMessage("이 게임은 1000점 만점 중 몇 점인가요~?")
            showKeypad("number", "1000", function () {
                game.clear()             
            })
        }
    }
}
// ==================================================================================


// Initiate Game
game.start(room1);  // 최초 시작 시 Room Type
game.printStory("<Notice>\n효과음이 일부 작을 수 있으므로\n적당히 소리를 키워주세요!\n또한, BGM은 컴퓨터 오른쪽의 스피커를 클릭해 ON/OFF를 클릭하시면 됩니다.\n재밌게 즐겨주세요~")
printMessage("어두워서 보이지 않는다... 스위치부터 찾아보자.");  //문구 출력