"use strict"

// Set variables
var symb = ['<', '>', '^', '?', '~']
var synt = [{open: '<', close: '>', mod: 0}, {open: '</', close: '>', mod: 0}, {open: '<', close: '/>', mod: 0}, {open: ' ', close: '', mod: 2}, {open: '', close: '', mod: 0}]
var tagsAll = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefront", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "c_input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "c_output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]
var grpSymb = ["[", "{", "("]
var mathOp = ["+", "-", "*", "/", "%", "^"]
var queryOp = ["=", "<", ">"]

let options = []
let tagsPri = []

let idTotal = 0
let elemList = []
let modList = []
let varList = []
let tagsOpenList = []
let append = ""
let appendClose = ""
let symbID = "F"
let modCrt = "F"
let modPre = "F"
let escType = ""
let elemStr = ""
let grpStr = ""

//_________________________

// LOCAL DATA FIELDS

// Input
let input = "INPUT CODE HERE"

// Options
options.push({optAutoFill: true})

// Priority Tags
tagsPri.push()

// Output
document.getElementById('display').innerHTML = compile(input, "main")

//_________________________

// Compile
function compile(c_input, str_name) {

let id = idTotal
idTotal++

let c_output = ""
let symbNum = 0

elemList.push([])
modList.push({pre: "F", crt: "F"})
varList.push([])
tagsOpenList.push([])

console.log("raw input")
console.log(c_input)
console.log("")
console.log("parse variables")


c_input = parse(id, c_input) + "~"

while (c_input[0] == " ") {
    c_input = c_input.slice(1, c_input.length)
}

for (let i = 0; i < c_input.length; i++) {
    if (c_input[i] == ">" && c_input[i + 1] == ">") {
        // close all
        let tagCloseStr = ""
        while (tagsOpenList[id].length > 0) {
            tagCloseStr += ">-" + tagsOpenList[id].pop()
        }
        c_input = c_input.slice(0, i) + tagCloseStr + "~" + c_input.slice(i + 2)
    } else if (c_input[i] == ">" && c_input[i + 1] == "_") {
        // close previous
        c_input = c_input.slice(0, i) + ">-" + tagsOpenList[id].pop() + "~" + c_input.slice(i + 2)
    } 
    if (symb.includes(c_input[i])) {
        // SYMBOL TRANSLATOR
        console.log("symbol at " + str_name + " " + i + " / " + symbNum) // show where found

        c_output += appendClose

        symbID = fetchSymbID(c_input[i], symbID)                        // Gets ID for current symbol in string
        elemList[id].push(symbID)                                       // Adds ID to respective element list
        modList[id].crt = synt[symbID].mod                              // Sets current modifier to the correct value
        translateSymb(id, modList[id].pre, modList[id].crt, symbNum)    // Creates tag from symbol
        c_output += append                                              // Adds tag to output
        modList[id].pre = synt[symbID].mod                              // Sets previous modifier to correct value

        symbNum++

        console.log("__________________") // formatting
    } else {
        if (c_input[i] == "|") {
            // ESCAPE
            i++
            elemStr += c_input[i]

            console.log(c_input[i] + "     --escape character")
            console.log("__________________") // formatting
        } else {
            elemStr += c_input[i]
            if (symb.includes(c_input[i + 1]) || i == c_input.length - 1) {

                console.log(c_input[i + 1])

                // === AUTO-FILL ===
                if (elemStr[0] == "-") {
                    elemStr = elemStr.slice(1, elemStr.length)
                } else {
                    if (symbID < 3 && options[0].optAutoFill) {
                        // open tags auto-fill
                        let tagID = tagsOpenList[id].length - 1
                        let fillType = "F"
                        if (symbID == 1) {
                            while (fillType == "F") {
                                if (tagID < 0) {
                                    fillType = 0
                                } else if (tagsOpenList[id][tagID].slice(0, elemStr.length).includes(elemStr)) {
                                    if (elemStr != tagsOpenList[id][tagID]) {
                                        fillType = 1
                                    } else {
                                        fillType = 0
                                    }
                                }
                            }
                        }

                        // priority auto-fill
                        fillType = (fillType == 0) ? "F" : fillType
                        tagID = (fillType == "F") ? 0 : tagID
                        while (fillType == "F") {
                            if (tagID == tagsPri.length) {
                                fillType = 0
                            } else if (tagsPri[tagID].slice(0, elemStr.length).includes(elemStr)) {
                                if (elemStr != tagsPri[tagID]) {
                                    fillType = 2
                                } else {
                                    fillType = 0
                                }
                            } else {
                                tagID++
                            }
                        }

                        // normal tags auto-fill
                        fillType = (fillType == 0) ? "F" : fillType
                        tagID = (fillType == "F") ? 0 : tagID
                        while (fillType == "F") {
                            if (tagID == tagsAll.length) {
                                fillType = 0
                            } else if (tagsAll[tagID].slice(0, elemStr.length).includes(elemStr)) {
                                if (elemStr != tagsAll[tagID]) {
                                    fillType = 3
                                } else {
                                    fillType = 0
                                }
                            } else {
                                tagID++
                            }
                        }

                        console.log("string at " + (i - elemStr.length))

                        elemStr = (fillType == 3) ? elemStr = tagsAll[tagID] : (fillType == 2) ? elemStr = tagsPri[tagID] : (fillType == 1) ? elemStr = tagsOpenList[id][tagID] : elemStr     // autofills if match was found

                        if (fillType > 0) {console.log(elemStr + "    --auto filled tag")}
                        if (fillType > 0) {console.log(fillType + "     --fill type")}
                        console.log(symb[symbID] + "         --symbol type")
                        if (symbID < 3) {console.log(tagID + "       --tag ID")}
                    } else {
                        console.log("string at " + (i - elemStr.length))
                        console.log(elemStr + "    --string data")
                        console.log(symb[symbID] + "         --symbol type")
                        console.log("__________________") // formatting
                    }

                    // manages open tags list
                    if (symbID == 0) {
                        console.log("open tags")
                        console.log(tagsOpenList[id])
                        console.log(elemStr + "   --added, became")

                        tagsOpenList[id].push(elemStr)

                        console.log(tagsOpenList[id])
                    }
                    
                    if (symbID == 1) {
                        let tagFound = false
                        let tagDelete = tagsOpenList[id].length - 1
                        while (!tagFound) {
                            if (tagsOpenList[id][tagDelete] == elemStr) {
                                tagFound = true
                            } else {
                                tagDelete--
                                tagFound = (tagDelete < 0) ? "none" : tagFound
                            }
                        }
                        console.log("open tags")
                        console.log(tagsOpenList[id])
                        console.log(tagsOpenList[id][tagDelete] + "   --removed, became")

                        if (tagFound) {tagsOpenList[id].splice(tagDelete, 1)}

                        console.log(tagsOpenList[id])
                    } else {
                        console.log("string at " + (i - elemStr.length))
                        console.log(elemStr + "    --string data")
                        console.log(symb[symbID] + "         --symbol type")
                        console.log("__________________") // formatting
                    }
                }
                c_output += elemStr
                console.log(elemStr + "   element string reset")
                elemStr = ""
            }
        }
    }
}

console.log("")
console.log(str_name + " input")
console.log(c_input)
console.log("")
console.log(str_name + " output")
console.log(c_output)
console.log("")
if (elemList[id].length > 0) {
    console.log(str_name + " element list")
    console.log(elemList[id])
}
if (varList[id].length > 0) {
    console.log("declared variables")
    for (let i = 0; i < varList[id].length; i++) {
        console.log(i + " // " + varList[id][i].chr + " / " + varList[id][i].data + "      --ID // character / data")
    }
}

return c_output

}

// Sub Functions
function fetchSymbID(find, symbID) {
    symbID = 0
    while (symb[symbID] !== find) {symbID++}
    console.log(symbID + " // " + symb[symbID] + " / " + find + "    --ID // symbol to find / symbol found")
    console.log(synt[symbID].open + "  " + synt[symbID].close + "         --open, close current")
    return symbID
}

function translateSymb(list_id, mod_pre, mod_crt, symb_num) {
    // 0 = container  (contains data, ex. <p> & </p>)
    // 1 = placeholder
    // 2 = sub data   (stored in containers, ex. style='color:red')
    append = "" 
    appendClose = ""
    symb_num **= (symb_num > 0) ? 1 : 0

    // closes previous (if applicable)
    if (mod_pre < 2 && mod_crt != 2) {
        append += synt[elemList[list_id][symb_num - 1]].close
    }
    console.log(mod_pre + "          --previous modifier")
    console.log(mod_crt + "          --current modifier")

    // adds opening syntax for current symbol
    append += synt[symbID].open
    
    console.log(append + "        --close prev, open current")
    // encapsulates current tag (if applicable)
    if (mod_crt == 2) {
        appendClose += synt[elemList[list_id][symb_num - 1]].close
    }
}

function parse(id, p_input) {
    let varFound = false
    
    // GROUP - VARIABLE - FUNCTION COMPILER
    for (let i = 0; i < p_input.length; i++) {
        let cmdType= p_input[i]
        if (p_input[i - 1] === "|" && grpSymb.includes(p_input[i])) {
            let grpChr = ""

            // GROUP
            for (let j = 0; grpSymb[j] != p_input[i]; j++) {escType = j + 1}
            console.log("******************") // formatting
            console.log("group at " + i)
            console.log(p_input[i] + " / " + escType + " / " + p_input[i + 1] + "          --group type / ID / char")

            grpChr = p_input[i + 1]
            i += 2
            let grpLen = 0
            while (p_input[i] != grpChr) {
                grpStr += p_input[i]
                grpLen++
                i++
            }

            console.log(grpStr + "     --data")
            console.log(grpLen + "         --length")

            p_input = p_input.slice(0, i - (grpLen + 3)) + p_input.slice(i + 1)
            if (escType == 2) {grpStr = escapeShortHTML(escapeHtmlEntities(grpStr))} else if (escType == 1) {grpStr = compile(grpStr, "group_" + id)} else if (escType == 0) {grpStr = escapeShortHTML(grpStr)}
            p_input = p_input.slice(0, i) + grpStr + p_input.slice(i + 1)
        }
        // group END
            
        // VARIABLE
        if (p_input[i - 1] === "|" && (p_input[i] === "v" || p_input[i] === "d")) {
            varFound = true
            let grpChr = p_input[i + 1]

            console.log("******************") // formatting
            console.log("variable at " + (i - 1))
            // if loading variable
            if (varList[id].some(e => e.chr === grpChr) && p_input[i] === "v") {
                i++
                // inserts variable directly into p_input so it can be read by compliler
                let varData = varList[id][varFind(id, grpChr, i)].data
                p_input = p_input.slice(0, i - 2) + varData + p_input.slice(i + 1)
            } else {
                // creates variable
                i += 2
                grpStr = ""
                let grpLen = 0
                while (p_input[i] != grpChr) {
                    grpStr += p_input[i]
                    grpLen++
                    i++
                }
                if (cmdType === "d") {
                    let varID = varFind(id, grpChr, i)
                    if (varID != "F") {
                        varList[id][varID] = {chr: grpChr, data: grpStr}
                    } else {
                        varSave(id, grpStr, grpChr, i)
                    }
                } else {
                    varSave(id, grpStr, grpChr, i)
                }
                p_input = p_input.slice(0, i - (grpLen + 3)) + p_input.slice(i + 1)
                i -= (grpLen + 3)
                console.log(grpLen + "         --length")
            }
        }
        // variable END

        // READ
        // find read range
        if (p_input[i - 1] === "|" && p_input[i] === "r") {
            let range = p_input[i + 1]
            let method = p_input[i + 2]
            let grpChr = p_input[i + 3]

            console.log(method + "     --find index method")
            console.log(grpChr + "     --group character")

            i += 4
            grpStr = ""
            let grpLen = 0
            let numStart = ""
            let numEnd = ""
            while (p_input[i] != grpChr) {
                if (p_input[i] == ",") {
                    numStart = grpStr
                    grpStr = ""
                    grpLen++
                    i++
                }
                grpStr += p_input[i]
                grpLen++
                i++
            }
            numEnd = grpStr
            numStart = (numStart === "") ? numEnd : numStart

            console.log(numStart + " / " + numEnd + "     --find index range")

            input = input.slice(0, i - (grpLen + 5)) + input.slice(i)
            p_input = p_input.slice(0, i - (grpLen + 5)) + p_input.slice(i)
            i-= (grpLen + 5)
            grpStr = ""

            // parse vars in read string
            numStart = parse(id, numStart) - 1
            numEnd = parse(id, numEnd) - 1

            // add read string to current string
            for (let j = numStart; j <= numEnd; j++) {
                j *= 1
                if (range == "m") {
                    grpStr += input[((i + 1) * (method === "r")) + j]
                } else {
                    grpStr += p_input[((i + 1) * (method === "r")) + j]
                }
            }
            if (method === "a" && numStart === -1 && numEnd === -1) {grpStr = p_input.slice(0, i) + p_input.slice(i + 1, p_input.length)}
            if (method === "r" && numStart === -1 && numEnd === -1) {grpStr = i + 1}
            p_input = p_input.slice(0, i) + grpStr + p_input.slice(i + 1)
            
            console.log(numStart + "    --read start")
            console.log(numEnd + "    --read end")
            console.log(grpStr + "    --read string")
        }
        // read END

        // GOTO
        if (p_input[i - 1] === "|" && p_input[i] === "g") {
            console.log("goto at " + (i - 1)) // formatting
            let method = p_input[i + 1]
            let grpChr = p_input[i + 2]

            console.log(method + "     --find index method")
            console.log(grpChr + "     --group character")

            i += 3
            grpStr = ""
            let grpLen = 0
            while (p_input[i] != grpChr) {
                grpStr += p_input[i]
                grpLen++
                i++
            }

            console.log(grpStr + "     --goto offset")

            p_input = p_input.slice(0, i - (grpLen + 4)) + p_input.slice(i + 1)
            i-= (grpLen + 4)

            // parse goto string
            grpStr = parse(id, grpStr)

            // goto position found
            p_input = p_input.slice(0, i) + p_input.slice((i * (method === "r")) + (grpStr * 1), p_input.length)

            console.log(i * (method === "r") + (grpStr * 1) + "      --goto index")
            console.log("__________________") // formatting
        }
        // goto END

        // MATH
        if (p_input[i - 1] === "|" && p_input[i] === "m") {
            let grpChr = "}"

            console.log(grpChr + "     --group character")

            i += 1
            grpStr = ""
            let grpLen = 0
            let numA = ""
            let numB = ""
            let numOp = ""
            while (p_input[i] != grpChr) {
                grpStr += p_input[i]
                grpLen++
                i++
            }
            numB = grpStr

            console.log(grpStr + "     --math operation")

            p_input = p_input.slice(0, i - (grpLen + 2)) + p_input.slice(i + 1)
            i-= (grpLen + 2)

            // parse read string
            let numCalc = eval(parse(id, grpStr))

            // add read string to current string
            p_input = p_input.slice(0, i) + numCalc + p_input.slice(i)
            console.log((numCalc) + "     --result")
        }
        // math END

        // IF STATEMENT
        if (p_input[i - 1] === "|" && p_input[i] === "i") {
            console.log("if statement at " + (i - 1)) // formatting
            let grpChr = p_input[i + 1]

            console.log(grpChr + "     --group character")

            // get query
            i += 2
            grpStr = ""
            let grpLen = 0
            let numA = ""
            let numB = ""
            let numOp = ""
            while (p_input[i] != grpChr) {
                if (queryOp.includes(p_input[i])) {
                    numA = grpStr
                    grpStr = ""
                    while (queryOp.includes(p_input[i])) {
                        numOp += p_input[i]
                        if (p_input[i] === "=") {numOp += "="; console.log(numOp)}
                        grpLen++
                        i++
                    }
                }
                grpStr += p_input[i]
                grpLen++
                i++
            }
            numB = grpStr

            // parse query
            numA = (parse(id, numA) * 1)
            numB = (parse(id, numB) * 1)
            let queryStr = eval(numA + numOp + numB)

            p_input = p_input.slice(0, i - (grpLen + 2)) + p_input.slice(i + 1)
            console.log(queryStr + "     --query string")
            i -= grpLen + 2

            // get if string
            grpStr = ""
            grpLen = 0
            while (p_input[i] != grpChr) {    
                grpStr += p_input[i]
                grpLen++
                i++
            }
            let ifStr = grpStr
            console.log(ifStr + "     --if string")
            p_input = p_input.slice(0, i - (grpLen + 1)) + p_input.slice(i + 1)
            i -= grpLen + 1
            console.log(p_input)

            // get else str
            let elStr = ""
            if (p_input[i] === "e") {
                console.log(grpChr)
                i++
                grpStr = ""
                let grpLen = 0
                while (p_input[i] != grpChr) {
                    grpStr += p_input[i]
                    grpLen++
                    i++
                }
                i -= 2
                elStr = grpStr
                console.log(elStr + "     --else string")
                console.log(elStr.length + "     --else length")
                console.log(p_input)
                p_input = p_input.slice(0, i - (grpLen - 1)) + p_input.slice(i + 3)
                console.log(p_input)
            }
            i -= 2
            let resultStr = (eval(queryStr)) ? ifStr : elStr
            p_input = p_input.slice(0, i) + resultStr + p_input.slice(i)
        }
        //if-else statement END
    }
    if (varFound) {p_input = parse(id, p_input)}
    return p_input
}

function varSave(list_id, grpStr, grpChr, loc) {
    let chrID = 0

    chrID = varList[list_id].length 
    varList[list_id].push({chr: grpChr, data: grpStr})
        
    console.log("variable saved at " + loc)
    console.log(chrID + " / " + grpChr + "     -- ID / character")
    console.log(varList[list_id][chrID].data + "        --data")
}

function varFind(list_id, grpChr, loc) {
    let output = ""
    let chrID = -1
    
    if (varList[list_id].some(e => e.chr === grpChr)) {

        do {chrID++} while (varList[list_id][chrID].chr != grpChr && chrID < varList[list_id].length)
        output = varList[list_id][chrID].data

        console.log("variable loaded at " + loc)
        console.log(output + "    --data")
        console.log(output.length + "         --length")
        console.log(chrID + " / " + grpChr + "     -- ID / character")
        console.log(varList[list_id][chrID].data + "        --data")
    } else {chrID = "F"}
    return chrID
}

function escapeShortHTML(esc_input) {
    console.log("__________________") // formatting
    console.log(esc_input + "    ---sHTML escape ipnut")

    let outputEsc = ""
    for (let i = 0; i < esc_input.length; i++) {
        if (symb.includes(esc_input[i]) || esc_input[i] == "|") {outputEsc += "|"}
        outputEsc += esc_input[i]
    }

    console.log(outputEsc + "    ---sHTML escape output")
    console.log("__________________") // formatting
    return outputEsc
}



// MASTER KEY
//
// Symbols:
//   <   --   open          <p          =          <p>
//   >   --   close         >p          =          </p>
//   <   --   self close    ^br         =          <br/>
//   ?   --   attribute     <p?style    =          <p style>
//   ~   --   string        ~text       =          text
//
// Shortcuts:
//   >_  --   close last    <p>_        =          <p></p>                (closes most recently opened tag)
//   >>  --   close all     <p<i>>      =          <p><i></i></p>         (closes all open tags)
//
// Groups:
//   |   --   escape        |^br        =          ^br
//   |(  --   plaintext     |(#^br#     =          ^br          format:   |(XYX   , X = limiting character, Y = data (displays as plaintext on page)
//   |{  --   sHTML compile |{#^br#     =          <br/>        format:   |[XYX   , X = limiting character, Y = data (compiled as sHTML, read as HTML by page)
//   |[  --   HTML compile  |(#<br/>#   =          <br/>        format:   |(XYX   , X = limiting character, Y = data (compiled and read as HTML by page)
//   |v  --   variable:         (declares and calls variables dynamically)
//              declare     |v#^br#   stored as    ^br          format:   |vXYX   , X = limiting character, Y = data (saved as variable named X, data is stored, can be called)
//              call        |v#         =          ^br          format:   |vX     , X = identity character, Y = data (calls variable named X, must already be declared)
//   |d  --   declare       |d#^br#   stored as    ^br          format:   |fXYX   , X = identity character, Y = data (saved as variable named X, can overwrite variable data)
//
// Functions
//   |r  --   read          |rma#14#               =         ^        (outputs 14th character of input string)
//      or                  |rma#14,16#            =         ^br      (outputs 14th through 16th character of input string)
//      or                  |rmr#14#               =         r        (outputs 14th character from current index of input string)
//      or                  |rca#2#                =         b        (outputs 2nd character of current string)
//          format: |rABXYX            , X = limiting character , Y = read index, A = string selector , B = find index method   , (a0 returns current string, r0 returns current index)
//
//   |g  --   goto          |ga#14#               sets character index to 14th of input string
//      or                  |gr#14#               sets character index to current character + 14
//          format: |gZXYX            , X = limiting character  , Y = data      , Z = find index method 
//
//   |m  --   math          |m1+2}                 =           3
//          format: |mXZY}            , X/Y = data              , Z = operator
//
//   |i  --   if            |i#|v$=1#^br#          =         <br/> (if |v$ is equal to 1)
//          format: |iXAZBXYX         , X = limiting character  , Y = data      , Z = equality type   , A/B = values
//
//   e  --   else           |i#|v$=1#^br#e<p#      =         <br/>   (if |v$ is equal to 1),   <p>   (if |v$ is not equal to 1)
//          format: |iXAZBXYXeYX      , X = limiting character  , Y = data      , Z = equality type   , A/B = values



// LICENSE
// MIT License

// Copyright (c) 2022 graizel (https://github.com/graizel/)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
