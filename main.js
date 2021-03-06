const table = document.querySelector('table')

const boardSize = [15,15]

const restartBtn = document.querySelector('button')

let board = []

let gameOver = false

class Node{
    x
    y
    state
    bomb
    number
    flag
    constructor(x,y,state,bomb,number){
        this.x = x
        this.y = y
        this.state = state
        this.bomb = bomb
        this.number = number
        this.flag = false
    }
}



function render(){
    let html = ''
    for(let i = 0; i < board.length; i++){
        html += '<tr>'
        for(let j = 0; j < board[i].length; j++){
            html += `<td class='${(board[i][j].bomb && (board[i][j].state == 'shown')) ? 'bomb' : board[i][j].state} x${board[i][j].x} y${board[i][j].y} ${board[i][j].flag ? 'flag' : ''}'>${((board[i][j].state == 'shown') && (board[i][j].number != undefined)) ? board[i][j].number : ''}</td>`
        }
        html += '</tr>'
    }
    table.innerHTML = html
    document.querySelectorAll('td').forEach(e => {
        e.onclick = () => {
            click(e.classList[1].replace('x',''),e.classList[2].replace('y',''))
        }
    })
}

function click(x,y){
    if(gameOver) return
    x = parseInt(x)
    y = parseInt(y)
    const current = board[y][x]
    current.state = 'shown'
    current.flag = false
    if(current.bomb){
        showBombs()
        gameOver = true
        alert('You lose')
        return
    }
    const bombCount = bombsNear(x,y)
    if(bombCount == 0){
        const check = [[-1,-1],[-1,0],[-1,1], [0,-1],[0,1], [1,-1],[1,0],[1,1]]
        for(let i = 0; i < check.length; i++){
            try{
                if(board[y + check[i][0]][x + check[i][1]].state == 'hidden') {
                    click(x + check[i][1], y + check[i][0])
                }
            }catch(e){
                
            }
        }
    }else{
        current.number = bombCount
    }
    render()
    if(checkWin()){
        gameOver = true
        showBombs()
        alert('You won!')
        return
    }
}

function showBombs(){
    const bombs = []
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j].bomb) bombs.push(board[i][j])
        }
    }
    for(let i = 0; i < bombs.length; i++){
        bombs[i].state = 'shown'
    }
    render()
}

function checkWin(){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if((board[i][j].bomb && board[i][j].state == 'shown') || (!board[i][j].bomb && board[i][j].state == 'hidden')) return false
        }
    }
    return true
}

function bombsNear(x,y){
    const check = [[-1,-1],[-1,0],[-1,1], [0,-1],[0,1], [1,-1],[1,0],[1,1]]
    let qnt = 0
    for(let i = 0; i < check.length; i++){
        try{
            if(board[y + check[i][0]][x + check[i][1]].bomb) qnt++
        }catch(e){

        }
    }
    return qnt
}


function generateBombs(number){
    for(let i = 0; i < number; i++){
        let loop = false
        do{
            const newBomb = {x: Math.floor(Math.random() * boardSize[0]), y: Math.floor(Math.random() * boardSize[1])}
            if(board[newBomb.x][newBomb.y].bomb){
                loop = true
            }else{
                loop = false
                board[newBomb.x][newBomb.y].bomb = true
            }
        }while(loop)
    }
}

function flag(x,y){
    if(board[y][x].state == 'hidden'){
        board[y][x].flag = !board[y][x].flag
        render()
    }
}

function start(boardPercentage){
    gameOver = false

    board = []

    for(let i = 0; i < boardSize[0]; i++) {
        board.push([])
        for(let j = 0; j < boardSize[1]; j++) {
            board[i].push(new Node(j,i,'hidden',false,undefined))
            board[i][j].x = j
            board[i][j].y = i
        }
    }

    generateBombs(Math.floor(boardSize[0] * boardSize[1] * (boardPercentage / 100)))
    render()

}

start(10)

table.addEventListener('contextmenu', e => {
    e.preventDefault()
    flag(e.target.classList[1].replace('x',''),e.target.classList[2].replace('y',''))
})

restartBtn.onclick = () => {
    start(10)
}