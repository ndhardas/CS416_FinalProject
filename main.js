const width = 800
const height = 500
var margin= {top:50, right:80, bottom:40, left:60}

let canvas = d3.select("svg")
canvas.attr("width", width)
canvas.attr("height", height)

function renderScene(sceneNumber){
  canvas.selectAll("*").remove()
  let buttons = d3.select("#controls")
  buttons.html("")

  if (sceneNumber === 1){
    renderScene1()
  } else if (sceneNumber == 2){
    renderScene2()
  }
  else if(sceneNumber===3)
  {
    renderScene3()
  }
  else if(sceneNumber==4){
    renderScene4()
  }
  else {
          console.log("blah blaj balhh")
  }
}
const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);


function renderScene1(){

  d3.csv("data/Seasons_Stats.csv").then(function(dat){
    var filteredData = dat.filter(function(row){
      return row.Year >= 1980 && row.PTS && row.G && row['3P'] && !(isNaN(+row.Year))
    })

    var grouped=d3.rollups(filteredData, function(values){
      let pts=d3.sum(values, function(item){ return +item.PTS })
      let threes=d3.sum(values, d=>+d['3P'])
      let games=d3.sum(values, d => +d.G)
      return {
        ppg: pts/games,
        threeppg: (3*threes)/games
      }
    }, function(d){ return +d.Year })

    let stats = grouped.map(function(pair){
      return {year: pair[0], ppg: pair[1].ppg, threePointPPG: pair[1].threeppg}
    }).sort(function(a,b){ return d3.ascending(a.year, b.year) })

    var g = canvas.append("g")
    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let widthInside = width - margin.left - margin.right
    let heightInside = height - margin.top - margin.bottom

    var xScale = d3.scaleLinear()
    xScale.domain(d3.extent(stats, function(d){ return d.year }))
    xScale.range([0, widthInside])

    var yMax = d3.max(stats, d=> Math.max(d.ppg, d.threePointPPG))
    var yScale = d3.scaleLinear().domain([0, yMax]).nice().range([heightInside, 0])

    let xAxisFn = d3.axisBottom(xScale).tickFormat(d3.format("d"))
    let yAxisFn = d3.axisLeft(yScale)

    let xAxisGroup = g.append("g")
    xAxisGroup.attr("transform", "translate(0," + heightInside + ")")
    xAxisGroup.call(xAxisFn)

    let yAxisGroup = g.append("g")
    yAxisGroup.call(yAxisFn)

    var line1 = d3.line()
      .x(function(d){return xScale(d.year)})
      .y(function(d){return yScale(d.ppg)})

    var line2 = d3.line()
    line2.x(d=>xScale(d.year))
    line2.y(d=>yScale(d.threePointPPG))

    g.append("path")
      .datum(stats)
      .attr("d", line1)
      .attr("fill","none")
      .attr("stroke", "steelblue")
      .attr("stroke-width",2)

    g.append("path").datum(stats)
      .attr("fill","none").attr("stroke","orange")
      .attr("stroke-width",2).attr("d",line2)

          g.append("line")
      .attr("x1", xScale(1994))
      .attr("x2", xScale(1994))
      .attr("y1", 0)
      .attr("y2", heightInside)
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "4 2");

    g.append("text")
      .attr("x", xScale(1994) + 5)
      .attr("y", 15)
      .attr("fill", "gray")
      .style("font-size", "11px")
      .style("font-family", "Arial")
      .text("1994: NBA shortened 3 Point line for one season");

          g.append("line")
      .attr("x1", xScale(2015))
      .attr("x2", xScale(2015))
      .attr("y1", 0)
      .attr("y2", heightInside)
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "4 2");

    g.append("text")
      .attr("x", xScale(2015) + 5)
      .attr("y", 15)
      .attr("fill", "gray")
      .style("font-size", "11px")
      .style("font-family", "Arial")
      .text("Curry MVP Season");

    let legendGroup = g.append("g")
    legendGroup.attr("transform", "translate("+(widthInside-150)+",0)")

    legendGroup.append("rect").attr("x",0).attr("y",0).attr("width",12).attr("height",12).attr("fill","steelblue")
    legendGroup.append("text")
    .attr("x",18).attr("y",10)
    .text("Total PPG")
    .style("font-size", "12px")
    .style("font-family", "Arial")

    legendGroup.append("rect")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", "orange")

    legendGroup.append("text").attr("x", 18)
    .attr("y", 30)
    .style("font-size", "12px")
    .style("font-family", "Arial")
    .text("3-Point PPG")
    console.log(legendGroup.APG)

    g.append("text")
    .attr("x", widthInside/2)
    .attr("y", -20)
    .style("font-size", "18px")
    .style("font-family", "Arial")
    .attr("text-anchor","middle")
    .text("NBA Points Per Game vs 3-Point Scoring (1980–Present)")

    g.append("text")
      .attr("x", widthInside / 2)
      .attr("y", heightInside + 35)
      .attr("text-anchor", "middle")
      .style("font-family", "Arial")
      .style("font-size", "12px")
      .text("Season")

    g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -heightInside/2)
    .attr("y", -40)
    .style("font-size", "12px")
    .style("font-family", "Arial")
    .attr("text-anchor", "middle")
    .text("Points Per Game")
  })


}

function renderScene2( ){ 
d3.csv("data/Seasons_Stats.csv").then(function(stuff){

  var filtered = stuff.filter(r=>{
    return r['Year']>=1980 && r.PTS && r["3P"] && !isNaN(+r.Year)
  })

  let grouped = d3.rollups(filtered, function(arr){
    let totalPoints = d3.sum(arr,function(z){return +z.PTS})
    var total3s = d3.sum(arr,x=>+x['3P']);
    var pct = (3*total3s/totalPoints)*100
    return { percent3s: pct }
  }, function(y){return +y.Year})

  let data = grouped.map(x=>{
    return {
      year: x[0],
      percent3s: x[1].percent3s
    }
  }).sort((a,b)=>a.year-b.year)

  var group = svg.append("g")
  group.attr("transform", "translate("+(margin.left)+","+margin.top+")")
  console.log(data, group)

  let w2 = width - margin.left - margin.right
  let h2 = height - margin.top - margin.bottom

  var x = d3.scaleLinear()
  x.domain(d3.extent(data, function(dd){ return dd.year}))
  x.range([0, w2])

  let y = d3.scaleLinear()
  y.domain([0,d3.max(data,d=>d.percent3s)]).nice().range([h2,0])

  var xA = d3.axisBottom(x)
  xA.tickFormat(d3.format("d"))

  let yA = d3.axisLeft(y).ticks(6)
  yA.tickFormat(function(val){return val+"%"})

  group.append("g").attr("transform","translate(0," + h2 + ")").call(xA)
  group.append("g").call(yA)

  var lineThing = d3.line()
  lineThing.x(function(thing){ return x(thing.year)})
  lineThing.y((thing)=>y(thing.percent3s))

  group.append("path")
  .datum(data)
  .attr("fill","none").attr("stroke","purple")
  .attr("stroke-width",2)
  .attr("d", lineThing)

    group.append("line")
    .attr("x1", x(1994))
    .attr("x2", x(1994))
    .attr("y1", 0)
    .attr("y2", h2)
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "4 2");

  group.append("text")
    .attr("x", x(1994) + 5)
    .attr("y", 15)
    .attr("fill", "gray")
    .style("font-size", "11px")
    .style("font-family", "Arial")
    .text("1994: NBA shortened 3P line");

          group.append("line")
    .attr("x1", x(2015))
    .attr("x2", x(2015))
    .attr("y1", 0)
    .attr("y2", h2)
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "4 2");

  group.append("text")
    .attr("x", x(2015) + 5)
    .attr("y", 15)
    .attr("fill", "gray")
    .style("font-size", "11px")
    .style("font-family", "Arial")
    .text("Curry MVP Season");


  var circleBits = group.selectAll("somethingCircles")
  circleBits.data(data)
  .enter()
  .append("circle")
  .attr("cx", function(pt){ return x(pt.year)})
  .attr("cy", function(p){return y(p.percent3s)})
  .attr("r",3)
  .attr("fill","purple")
  .append("title")
  .text((d)=>d.year + ": " + d.percent3s.toFixed(1) + "%")

  var legendsRfun = svg.append("g")
  legendsRfun.attr("transform", "translate("+(width-margin.right-120)+","+margin.top+")")

  legendsRfun.append("rect")
  .attr("width", 10).attr("height", 10).attr("fill","purple")

  legendsRfun.append("text")
  .attr("x", 15)
  .attr("y", 10)
  .style("font-size", "12px")
  .style("font-family", "Arial")
  .text("% of Total Points from 3s")

  svg.append("text")
  .attr("x", width/2)
  .attr("y", margin.top/2)
  .attr("text-anchor", "middle")
  .style("font-size","18px")
  .style("font-family","Arial")
  .text("Percentage of Scoring from 3-Pointers (1980–Present)")

}) }



function renderScene3( ) {

  let pace = {
    1980:101.6,1981:100.8,1982:101.2,1983:102.1,1984:102.1,1985:101.6,
    1986:100.8,1987:101.1,1988:100.6,1989:99.5,1990:98.3,1991:96.8,
    1992:95.4,1993:94.5,1994:91.6,1995:91.6,1996:91.1,1997:90.7,
    1998:89.8,1999:88.9,2000:90.1,2001:91.0,2002:91.3,2003:90.1,
    2004:90.1,2005:90.8,2006:91.6,2007:92.1,2008:93.7,2009:95.0,
    2010:94.1,2011:92.1,2012:91.3,2013:92.0,2014:92.9,2015:94.2,
    2016:96.4,2017:97.3,2018:100.0,2019:100.3,2020:99.2,
    2021:98.2,2022:99.2,2023:98.5
  };

  d3.csv("data/Seasons_Stats.csv").then(function(lerbon){

    lerbon = lerbon.filter(function(d){
      return d.Year && d.Pos && d.AST && d.G
    }).map(function(row){
      let y = +row.Year
      let g = +row.G
      let a = +row.AST
      let position = row.Pos.split("-")[0]
      let p = pace[y]
      return {
        Year: y,
        Pos: position,
        APG: (g > 0 && p) ? (a / g / p) * 100 : null
      }
    }).filter(x=>x.APG!=null && x.Pos!="G" && x.Pos!="F")

    let weirdMap = d3.rollups(lerbon,
      function(grp){ return d3.mean(grp, d=>d.APG) },
      function(d){ return d.Year },
      d=>d.Pos)

    let final = []
    weirdMap.forEach(function(pair){
      let y = pair[0]
      pair[1].forEach(function(thing){
        final.push({Year: y, Pos: thing[0], AvgAPG: thing[1]})
      })
    })

    let posiThings = Array.from(new Set(final.map(x=>x.Pos)))

    let x = d3.scaleLinear()
    x.domain(d3.extent(final,d=>d.Year))
    .range([0,width - margin.left - margin.right])

    var y = d3.scaleLinear()
    y.domain([0,d3.max(final,d=>d.AvgAPG)]).nice()
    .range([height-margin.top-margin.bottom,0])

    let color = d3.scaleOrdinal(d3.schemeSet2).domain(posiThings)

    let g = svg.append("g")
    g.attr("transform","translate(" + margin.left + "," + margin.top + ")")

    g.append("g")
      .attr("transform", "translate(0," + (height-margin.top-margin.bottom) + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))

    g.append("g").call(d3.axisLeft(y))

    svg.append("text")
    .attr("x", width/2)
    .attr("y", height-5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Season")

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", 15)
    .attr("text-anchor","middle")
    .style("font-size", "12px")
    .text("Adjusted Assists per 100 Possessions")

    svg.append("text")
    .attr("x", width/2)
    .attr("y", margin.top/2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Adjusted Assists Per 100 Possessions by Position (1980–Present)")

    var lineDraw = d3.line()
    lineDraw.x(function(d){ return x(d.Year) })
    lineDraw.y(function(d){ return y(d.AvgAPG) })

    let groups = d3.group(final, function(d){ return d.Pos })

    groups.forEach(function(values, posName){
      g.append("path")
        .datum(values)
        .attr("d", lineDraw)
        .attr("fill", "none")
        .attr("stroke", color(posName))
        .attr("stroke-width", 2)

      g.append("text")
        .datum(values[values.length - 1])
        .attr("x", function(d){ return x(d.Year) + 5 })
        .attr("y", function(d){ return y(d.AvgAPG) })
        .attr("fill", color(posName))
        .style("font-size", "10px")
        .text(posName)
    })

  })
}

function renderScene4(   ) {
  const tooltip = d3.select("#tooltip");

  d3.selectAll("svg > *").remove()
  d3.select("#controls").html("")

  d3.csv("data/Seasons_Stats.csv").then(function(data){

    data = data.filter(function(d){
      return d.Player && d.Year && d.AST && d["3P"] && d.G &&
      !isNaN(+d.AST) && !isNaN(+d["3P"]) && !isNaN(+d.G)
    })

    data.forEach((thing)=>{
      thing.Year = +thing.Year;
      thing.G = +thing.G;
      thing.APG = +thing.AST / thing.G;
      thing["3P_per_game"] = +thing["3P"] / thing.G;
    })

    const legends = new Set([
      "LeBron James", "Michael Jordan", "Kobe Bryant", "Stephen Curry", "Magic Johnson",
      "Larry Bird", "Shaquille O'Neal", "Kareem Abdul-Jabbar", "Tim Duncan", "Kevin Durant",
      "Wilt Chamberlain", "Bill Russell", "Oscar Robertson", "Hakeem Olajuwon", "Dirk Nowitzki",
      "Dwyane Wade", "Giannis Antetokounmpo", "Karl Malone", "Charles Barkley", "Chris Paul",
      "Steve Nash", "David Robinson", "Scottie Pippen", "Allen Iverson", "James Harden",
      "Jason Kidd", "Kevin Garnett", "Elgin Baylor", "Isiah Thomas", "Jerry West",
      "Paul Pierce", "Ray Allen", "Russell Westbrook", "Anthony Davis", "Dwight Howard",
      "Reggie Miller", "Tracy McGrady", "Vince Carter", "Patrick Ewing", "Dominique Wilkins",
      "Clyde Drexler", "Bob Cousy", "George Gervin", "Dennis Rodman", "Pau Gasol",
      "Yao Ming", "Alonzo Mourning", "Damian Lillard", "Nikola Jokic", "Joel Embiid",
      "Kawhi Leonard", "Manu Ginobili", "Tony Parker", "Grant Hill", "Chris Webber",
      "LaMarcus Aldridge", "Ben Wallace", "Marc Gasol", "Blake Griffin", "DeMarcus Cousins",
      "Zach Randolph", "Draymond Green", "DeAndre Jordan", "Kyrie Irving", "Klay Thompson",
      "Jimmy Butler", "DeMar DeRozan", "Paul George", "Carmelo Anthony", "John Stockton",
      "Joe Dumars", "Amar’e Stoudemire", "Shawn Kemp", "Mark Price", "Brad Daugherty",
      ,"Baron Davis","Stephon Marbury","Deron Williams","Chauncey Billups",
      "Gilbert Arenas","Rip Hamilton","Carlos Boozer","Rasheed Wallace","Antoine Walker",
      "Peja Stojakovic","Latrell Sprewell","Jason Terry","Michael Finley","Shane Battier",
      "Tayshaun Prince","Metta World Peace","Ron Harper","Nick Van Exel","Toni Kukoc",
      "Detlef Schrempf","Juwan Howard","Tom Chambers","Danny Granger","Jack Sikma"
    ])

    var fData = data.filter(d=>legends.has(d.Player))

    let dd = d3.select("#controls").append("select")
    dd.on("change", function(){ show(this.value) })

    let guys = Array.from(new Set(fData.map(d=>d.Player))).sort()
    dd.selectAll("option")
      .data(guys)
      .enter()
      .append("option")
      .text(d=>d)

    show(guys[0])

    function show(player){

      d3.selectAll("svg > *").remove()

      let val = fData.filter(z=>z.Player==player)

      let w = width - margin.left - margin.right
      let h = height - margin.top - margin.bottom

      var x = d3.scaleLinear().domain(d3.extent(val,d=>d.Year)).range([0,w])
      var y = d3.scaleLinear().domain([0,d3.max(val,d=>Math.max(d.APG,d["3P_per_game"]))]).nice().range([h,0])
      var c = d3.scaleOrdinal().domain(["APG","3P/G"]).range(["steelblue","orange"])

      var g = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")")

      g.append("g").attr("transform","translate(0,"+h+")").call(d3.axisBottom(x).tickFormat(d3.format("d")))
      g.append("g").call(d3.axisLeft(y))

      svg.append("text")
      .attr("x", width/2).attr("y", height-5)
      .attr("text-anchor","middle").style("font-size","12px")
      .text("Season")

      svg.append("text")
      .attr("transform","rotate(-90)")
      .attr("x", -height/2).attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Per Game Metrics")

      var line = function(metric){
        return d3.line().x(d=>x(d.Year)).y(d=>y(d[metric]))
      }

      g.append("path")
        .datum(val)
        .attr("fill","none")
        .attr("stroke", c("APG"))
        .attr("stroke-width",2)
        .attr("d", line("APG"))

      g.append("path")
        .datum(val)
        .attr("fill","none")
        .attr("stroke", c("3P/G"))
        .attr("stroke-width",2)
        .attr("d", line("3P_per_game"))

      g.selectAll(".dot1")
      .data(val)
      .enter()
      .append("circle")
      .attr("cx", d=>x(d.Year))
      .attr("cy", d=>y(d.APG))
      .attr("r", 4)
      .attr("fill", c("APG"))
      .on("mouseover", (e,d)=>{
        tooltip.html("Year: "+d.Year+"<br>APG: "+d.APG.toFixed(1))
        .style("left", e.pageX+10+"px")
        .style("top", e.pageY-28+"px")
        .style("visibility", "visible")
      }).on("mouseout", ()=>tooltip.style("visibility", "hidden"))

      g.selectAll(".dot2")
      .data(val)
      .enter()
      .append("circle")
      .attr("cx", d=>x(d.Year))
      .attr("cy", d=>y(d["3P_per_game"]))
      .attr("r", 4)
      .attr("fill", c("3P/G"))
      .on("mouseover", function(e,d){
        tooltip.html("Year: "+d.Year+"<br>3P/G: "+d["3P_per_game"].toFixed(1))
        .style("left", e.pageX+10+"px")
        .style("top", e.pageY-28+"px")
        .style("visibility", "visible")
      }).on("mouseout", function(){
        tooltip.style("visibility", "hidden")
      })

      let boxThing = g.append("g").attr("transform", "translate("+(w-110)+",20)")

      boxThing.append("rect")
        .attr("x",-10).attr("y",-10).attr("width",90).attr("height",40)
        .attr("fill","white").attr("stroke","lightgray")

      ;["APG","3P/G"].forEach(function(whoever, i){
        boxThing.append("rect")
          .attr("x",0).attr("y",i*18)
          .attr("width",10).attr("height",10)
          .attr("fill", c(whoever))

        boxThing.append("text")
          .attr("x",15).attr("y",i*18+9)
          .style("font-size", "12px")
          .text(whoever)
      })

      svg.append("text")
        .attr("x", width/2)
        .attr("y", margin.top/2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("APG & 3P/G Over Time: " + player)

svg.append("text")
  .attr("x", width - margin.right - 10)
  .attr("y", margin.top - 10)
  .attr("text-anchor", "end")
  .style("font-size", "11px")
  .style("font-family", "Arial")
  .style("fill", "gray")
  .text("Hover over points for more detail");

    }

  })
}

renderScene(1); 