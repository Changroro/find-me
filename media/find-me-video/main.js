'use strict';
Object.assign(THEME, {ink:HD.ink,paper:HD.paper,dark:HD.dark});

function developer(x,y,t,{scale=1,tired=false,sit=false,walk=false}={}) {
  shadow(x,y+3,82*scale);
  ctx.save();
  ctx.translate(x,y+(walk?Math.sin(t*7)*3:Math.sin(t*2)*1.5));
  ctx.scale(scale,scale);
  const leg=walk?Math.sin(t*7)*7:0;
  rc.line(-18,-42,sit?-57:-20+leg,-4,hdLine(41,{strokeWidth:7}));
  rc.line(18,-42,sit?55:22-leg,-4,hdLine(42,{strokeWidth:7}));
  rc.ellipse(sit?-65:-27+leg,0,32,12,hdLine(43,{fill:HD.ink,fillStyle:'solid'}));
  rc.ellipse(sit?64:29-leg,0,32,12,hdLine(44,{fill:HD.ink,fillStyle:'solid'}));
  ctx.save();
  ctx.translate(tired?7:0,tired?15:0);
  ctx.rotate(tired?.08:0);
  rc.ellipse(0,-88,104,120,hdLine(45,{fill:HD.accent,fillStyle:'solid'}));
  rc.line(-35,-114,-70,-71,hdLine(46,{strokeWidth:8}));
  rc.line(35,-114,70,-71,hdLine(47,{strokeWidth:8}));
  rc.line(0,-145,0,-132,hdLine(48,{strokeWidth:8}));
  rc.ellipse(0,-185,100,96,hdLine(49,{fill:HD.paper,fillStyle:'solid',strokeWidth:3}));
  rc.polygon([[-47,-193],[-47,-217],[-27,-237],[0,-239],[28,-229],[47,-207],[46,-191],[25,-198],[5,-211],[-15,-199]],hdLine(50,{fill:HD.ink,fillStyle:'solid',roughness:.7}));
  const blink=Math.sin(t*2.5)>.985;
  if(tired||blink){
    rc.line(-27,-184,-12,-181,hdLine(51));
    rc.line(12,-181,27,-184,hdLine(52));
  }else{
    rc.circle(-19,-181,8,hdLine(51,{fill:HD.ink,fillStyle:'solid'}));
    rc.circle(19,-181,8,hdLine(52,{fill:HD.ink,fillStyle:'solid'}));
  }
  rc.curve(tired?[[-11,-156],[0,-161],[11,-156]]:[[-11,-160],[0,-155],[11,-160]],hdLine(53));
  rc.rectangle(-61,-122,122,76,hdLine(54,{fill:HD.paper,fillStyle:'solid',strokeWidth:3}));
  rc.rectangle(-50,-111,100,52,hdLine(55,{stroke:HD.muted,strokeWidth:1.3}));
  rc.line(-34,-96,-8,-96,hdLine(56,{stroke:HD.accent}));
  rc.line(-34,-83,30,-83,hdLine(57,{stroke:HD.accent}));
  rc.polygon([[-61,-46],[61,-46],[79,-27],[-79,-27]],hdLine(58,{fill:HD.paper,fillStyle:'solid',strokeWidth:2.5}));
  rc.line(-44,-36,44,-36,hdLine(59,{stroke:HD.muted,strokeWidth:1.5}));
  rc.ellipse(-66,-72,15,25,hdLine(60,{fill:HD.paper,fillStyle:'solid'}));
  rc.ellipse(66,-72,15,25,hdLine(61,{fill:HD.paper,fillStyle:'solid'}));
  ctx.restore();
  if(tired)text('…',116,-210,{font:HD.script,size:54,color:HD.muted,jit:false});
  ctx.restore();
}

function headline(lines,y=165,{size=86,p=1,color=HD.ink}={}) {
  lines.forEach((line,i)=>text(line,W/2,y+i*(size+25),{font:HD.serif,size,color,jit:false,alpha:prog(p,i*.12,i*.12+.4),maxW:1720}));
}
function label(s) {
  text(s,100,66,{font:HD.mono,size:24,color:HD.muted,align:'left',jit:false});
}
function caption(s,y=985,p=1) {
  text(s,W/2,y,{font:HD.script,size:42,color:HD.accent,jit:false,alpha:prog(p,0,.45),maxW:1710});
}
function paper(x,y,w,h,labelText,lines,p,id) {
  ctx.save();ctx.globalAlpha=prog(p,0,.4);
  rc.rectangle(x,y,w,h,hdLine(id,{fill:HD.paper,fillStyle:'solid'}));
  text(labelText,x+32,y+45,{font:HD.script,size:40,color:HD.accent,align:'left',jit:false,maxW:w-64});
  lines.forEach((line,i)=>text(line,x+32,y+115+i*57,{font:HD.sans,size:36,align:'left',jit:false,maxW:w-64}));
  ctx.restore();
}
function skillTitle(name,action,t) {
  hdPaper();
  text('find-me',100,66,{font:HD.serif,size:34,color:HD.muted,align:'left',jit:false});
  text('find-me:'+name,W/2,155,{font:HD.mono,size:72,jit:false,reveal:prog(t,.05,.8),maxW:1700});
  const w=measure('find-me:'+name,HD.mono,72);
  sketch([[W/2-w/2,209],[W/2,217],[W/2+w/2,209]],prog(t,.5,1.1),190,{stroke:HD.accent,strokeWidth:4});
  text(action,W/2,305,{font:HD.serif,size:62,jit:false,alpha:prog(t,.4,.9),maxW:1700});
}
function wordmark(y,size,p) {
  text('find-me',W/2,y,{font:HD.serif,size,jit:false,reveal:p});
  const w=measure('find-me',HD.serif,size);
  sketch([[W/2-w/2,y+size*.43],[W/2,y+size*.48],[W/2+w/2,y+size*.42]],prog(p,.65,1),810,{stroke:HD.accent,strokeWidth:5});
}

boot({
  noise:2,
  fonts:[['SERIF','나 find-me'],['SCRIPT','내 기준'],['SANS','기록'],['MONO','setup']],
  scenes:[
    [0,5,t=>{
      hdPaper();label('계속 쏟아지는 소식 · AI 포모');
      headline(['새 모델, 새 뉴스, 또 새 모델.','나만 뒤처지는 걸까?'],150,{p:t});
      horizon(885);cloud(170+t*8,462,.7,101);cloud(1710-t*6,456,.6,102);
      [['새 모델 출시',350,555],['새 AI 뉴스',1510,520],['또 새 모델 출시',1460,702]].forEach(([s,x,y],i)=>{
        const p=prog(t,.35+i*.55,.9+i*.55);
        ctx.save();ctx.globalAlpha=p;
        rc.rectangle(x-175,y-45,350,90,hdLine(110+i,{fill:HD.paper,fillStyle:'solid'}));
        text(s,x,y,{font:HD.script,size:43,color:HD.muted,jit:false});ctx.restore();
      });
      developer(W/2,885,t,{scale:1.15,tired:t>2.4});
      caption('따라잡으려 할수록, 마음은 더 조급해진다.',985,t-1.2);
    }],
    [5,10,t=>{
      hdPaper();label('AI와 일하는 나');
      headline(['AI는 많이 쓰는데,','나는 뭘 잘하는 걸까?'],155,{p:t});
      horizon(885);developer(430,885,t,{scale:1.25,tired:true,sit:true});
      paper(795,455,800,280,'해낸 일은 쌓이는데',['내가 한 판단은 무엇일까?','내가 이해한 건 무엇일까?'],t,210);
      rc.curve([[605,545],[635,505],[675,558],[645,590],[640,621]],hdLine(220,{stroke:HD.muted}));
      rc.circle(640,646,6,hdLine(221,{fill:HD.muted,fillStyle:'solid'}));
      caption('도구를 쓰는 나와, 나의 역량 사이에서.',985,t-.7);
    }],
    [10,15,t=>{
      skillTitle('setup','내가 알아갈 주제부터 정한다.',t);
      horizon(885);developer(370,885,t,{scale:1.15});
      paper(690,435,890,310,'내가 알고 싶은 주제',['나의 일하는 방식','나의 판단 기준','나의 고민'],t-.6,310);
      [0,1,2].forEach(i=>sketch([[1430,547+i*57],[1444,559+i*57],[1477,529+i*57]],prog(t,.8+i*.4,1.4+i*.4),320+i,{stroke:HD.accent,strokeWidth:4}));
      text('기록 문서: 나의 기록.md',1135,805,{font:HD.mono,size:32,color:HD.muted,jit:false,alpha:prog(t,1.8,2.3)});
      caption('주제와 저장 위치를, 내게 맞게.',985,t-.9);
    }],
    [15,20,t=>{
      skillTitle('write-record','내 대화에서, 나를 발견한다.',t);
      horizon(890);developer(260,890,t,{scale:1.05});
      paper(540,455,555,270,'내가 직접 한 말',['“변경 이유를 알고','진행하는 게 좋아요.”'],t-.5,410);
      paper(1190,455,605,270,'기록에서 발견한 나',['변경 이유를 이해한 뒤','진행하는 방식을 선호한다.'],t-1.1,420);
      arrow([[1110,590],[1135,586],[1170,590]],prog(t,1,1.7),430,{stroke:HD.accent,strokeWidth:3});
      text('이전 기록과 비교 · 발견 + 실제 대화 맥락',1150,815,{font:HD.script,size:39,color:HD.accent,jit:false,alpha:prog(t,1.5,2)});
      caption('나의 말과 선택이, 나를 이해하는 단서가 된다.',985,t-1.2);
    }],
    [20,25,t=>{
      skillTitle('fix-record','피드백으로, 내 기록을 다듬는다.',t);
      horizon(885);developer(370,885,t,{scale:1.15});
      paper(720,445,870,305,t<2.7?'내 피드백':'다음 기록',t<2.7?['“내 말과 상황을','더 구체적으로 담아줘.”']:['내가 실제로 한 말과','판단 이유를 구체적으로 남긴다.'],t-.5,510);
      sketch([[754,626],[1030,632],[1430,626]],prog(t,1.3,2),520,{stroke:HD.accent,strokeWidth:4});
      text('개인 프롬프트 수정 → 다음 기록부터 반영',1150,813,{font:HD.script,size:39,color:HD.accent,jit:false,alpha:prog(t,2,2.5)});
      caption('기록도, 나에게 맞는 방식으로.',985,t-1.2);
    }],
    [25,30,t=>{
      hdPaper();
      headline(['남의 속도를 쫓던 내가,','나의 방향을 찾아간다.'],145,{size:79,p:t});
      wordmark(475,148,prog(t,.4,1.2));
      text('setup · write-record · fix-record',W/2,660,{font:HD.mono,size:36,color:HD.accent,jit:false,alpha:prog(t,1,1.5),maxW:1710});
      text('Claude Code · Codex',W/2,734,{font:HD.sans,size:30,jit:false,alpha:prog(t,1.2,1.7)});
      text('github.com/Changroro/find-me',W/2,800,{font:HD.mono,size:28,color:HD.muted,jit:false,alpha:prog(t,1.4,1.9)});
      horizon(965);developer(lerp(350,640,E.inOut(prog(t,0,3.9))),965,t,{scale:.8,walk:t<3.9});cloud(1590,903,.45,610);
      text('손그림 스타일 참고: @nahiddotai',W-70,H-34,{font:HD.sans,size:18,color:HD.muted,align:'right',jit:false});
    }]
  ]
});
