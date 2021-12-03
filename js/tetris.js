// DOM
const playground = document.querySelector(".playground > ul")

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;


// variables
let score = 0
let duration = 500
let downInterval
let tempMovingItem // 테트리스 조각이 나오기전 저장될 공간

const BLOCKS = {
    tree : [
        [[2,1],[0,1],[1,0],[1,1]],
        [[1,2],[0,1],[1,0],[1,1]],
        [[1,2],[0,1],[2,1],[1,1]],
        [[2,1],[1,2],[1,0],[1,1]],
    ]
}
const MovingItem = {      //다음 나올테트리스조각의 타입과 정보
    type : "tree",
    direction : 3, //조각들 방향 조절
    top : 0, //조각들이 위아래로 어디까지 내려올지 조작
    left : 0, // 조각들이 양옆으로 어디까지 내려올지 조작
}

init()
//functions
function init(){
    tempMovingItem = { ...MovingItem}//잠시 저장될 공간, 값이 저장되는게 아닌 틀만 저장됨, 깊은복사는 변수로 따로 지정해서 함

    for (let i = 0; i<GAME_ROWS; i++){
        prependNewline()
    } 
    renderBlocks();
}

function prependNewline(){
    const li = document.createElement("li")
    const ul = document.createElement("ul")
    for(let j=0; j<10; j++){
        const matrix = document.createElement("li")
        ul.prepend(matrix) 
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(moveType=""){
    const { type, direction, top, left} = tempMovingItem
    const movingBlocks = document.querySelectorAll(".moving")

    movingBlocks.forEach(moving=>{          //이동했을때 이전블럭들 제거
        moving.classList.remove(type,"moving")
    })

    BLOCKS[type][direction].forEach(block=>{
        const x = block[0] + left //처음시작 위치 지정
        const y = block[1] + top
        const target = playground.childNodes[y] ?  playground.childNodes[y].childNodes[0].childNodes[x] : null // 타겟선택
        const isAvailable = checkEmpty(target) // 쌓인 블럭들이 넘치지 않았는지 체크
        
        if(isAvailable){
            target.classList.add(type,"moving")
        } else{
            tempMovingItem = {...MovingItem} //원상복구
            setTimeout(()=>{
                renderBlocks() //다시 부르기 (재귀)
                if(moveType === "top"){
                    seizeBlock()
                }
            },0)   //setTimeout은 스텍이 무한정으로 불러지는걸 방지하기위해 사용
        }
    })
    MovingItem.left = left
    MovingItem.top = top
    MovingItem.direction = direction
}

function seizeBlock(){

}

function checkEmpty(target){
    if(!target){
        return false
    }
    return true
}

function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount
    renderBlocks(moveType)
}

function changeDirection(){
    const direction = tempMovingItem.direction
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction +=1
    renderBlocks()
}
// event handling
document.addEventListener("keydown", e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left",1)
            break;
        case 37:
            moveBlock("left",-1)
            break;
        case 38:
            changeDirection()
            break;
        case 40:
            moveBlock("top",1)
            break;
        default:
            break;
    }
})

// prepend() : 콘텐츠를 선택한 요소 내부의 시작 부분에서 삽입
// append() : 컨텐츠를 선택된 요소 내부의 끝 부분에 삽입
// after() : 선택한 요소 뒤에 컨텐츠 삽입
// before() : 선택된 요소 앞에 컨텐츠 삽입

//classList.add('클래스명') 클래스 하나 추가

// 44:54