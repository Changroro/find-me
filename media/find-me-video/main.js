'use strict';
Object.assign(HD, {accent:'#26786b',tag:'#e3ece6'});
Object.assign(THEME, {ink:HD.ink,paper:HD.paper,dark:HD.dark});

const face={'.':'transparent',h:HD.ink,s:'#dacdb9',e:HD.ink,b:HD.accent,p:HD.ink,l:'#a5b0aa',c:'#f4f2ee'};
const standing=[
  '......hhhhhh.......',
  '.....hhhhhhhh......',
  '.....hssssssh......',
  '.....hsessesh......',
  '......ssssss.......',
  '.......ssss........',
  '.....bbbbbbbb......',
  '....bbbbbbbbbb.....',
  '....bsllllllll.....',
  '....bsllccccll.....',
  '.....sllccccll.....',
  '.....bllllllll.....',
  '.....bllllllll.....',
  '.....bbbbbbbb......',
  '......pppppp.......',
  '......pp..pp.......',
  '......pp..pp.......',
  '.....ppp..ppp......'
];
const sitting=[
  '......hhhhhh.......',
  '.....hhhhhhhh......',
  '.....hssssssh......',
  '.....hsessesh......',
  '......ssssss.......',
  '.......ssss........',
  '.....bbbbbbbb......',
  '....bbbbbbbbbb.....',
  '....bsllllllll.....',
  '....bsllccccll.....',
  '.....sllccccll.....',
  '.....bllllllll.....',
  '.....bllllllll.....',
  '.....bbbbbbbb......',
  '.....pppppppppp....',
  '.....pp......pp....',
  '.....pp.....ppp....',
  '....ppp............'
];

function dev(x,y,t,{size=14,tired=false,sit=false,walk=false}={}) {
  const bob=walk?Math.sin(t*8)*5:Math.sin(t*2)*2;
  shadow(x,y+3,110);
  drawPixels(sit?sitting:standing,{...face,b:tired?'#888781':HD.accent},x,y+bob,size,{rot:tired?.07:0});
  if (tired) {
    rc.line(x-36,y-205,x-16,y-200,hdLine(70));
    rc.line(x+6,y-200,x+26,y-205,hdLine(71));
    text('…',x+150,y-215,{font:HD.script,size:70,color:HD.muted,jit:false});
  }
}
function title(lines,y=185,{size=90,color=HD.ink,p=1}={}) {
  lines.forEach((line,i)=>text(line,W/2,y+i*(size+24),{font:HD.serif,size,color,jit:false,alpha:prog(p,i*.12,i*.12+.45),maxW:1700}));
}
function tag(label) {
  text(label,100,72,{font:HD.mono,size:22,color:HD.muted,align:'left',jit:false});
}
function foot(label,color=HD.muted) {
  text(label,W/2,990,{font:HD.sans,size:28,color,jit:false});
}
function note(x,y,w,h,label,lines,p,id) {
  ctx.save();ctx.globalAlpha=prog(p,0,.4);
  rc.rectangle(x,y,w,h,hdLine(id,{fill:HD.paper,fillStyle:'solid'}));
  text(label,x+32,y+45,{font:HD.script,size:40,color:HD.accent,align:'left',jit:false});
  lines.forEach((line,i)=>text(line,x+32,y+115+i*56,{font:HD.sans,size:36,align:'left',jit:false,maxW:w-64}));
  ctx.restore();
}
function wordmark(y,size,p,color=HD.ink) {
  text('find-me',W/2,y,{font:HD.serif,size,color,jit:false,reveal:p});
  const w=measure('find-me',HD.serif,size);
  sketch([[W/2-w/2,y+size*.43],[W/2,y+size*.48],[W/2+w/2,y+size*.42]],prog(p,.65,1),810,{stroke:HD.accent,strokeWidth:5,roughness:.8});
}

boot({
  noise:2,
  fonts:[['SERIF','나 find-me'],['SCRIPT','내 기준'],['SANS','기록'],['MONO','설정']],
  scenes:[
    [0,4,t=>{
      hdPaper();tag('쫓기는 하루 · AI 포모');
      title(['또 새로운 AI.','나는 또 뒤처진 걸까?'],170,{size:90,p:t});
      horizon(865);cloud(210+t*12,450,.8,101);cloud(1620-t*8,440,.7,103);
      [['새 모델 등장',360,545],['새로운 도구',1510,520],['오늘도 따라잡기',1350,690]].forEach(([label,x,y],i)=>{
        const p=prog(t,i*.65+.4,i*.65+1);
        ctx.save();ctx.globalAlpha=p;
        rc.rectangle(x-155,y-40,310,80,hdLine(200+i,{fill:HD.paper,fillStyle:'solid'}));
        text(label,x,y,{font:HD.script,size:38,color:HD.muted,jit:false});ctx.restore();
      });
      dev(940,865,t,{tired:t>2});
      foot('새 소식을 쫓다 보니, 내 목소리가 작아졌다.');
    }],
    [4,7,t=>{
      hdPaper();tag('잠시 멈춤');
      title(['다 따라가려 할수록,','나는 더 지쳐갔다.'],180,{size:88,p:t});
      horizon(865);cloud(1450,490,.9,304);
      dev(W/2,865,t,{tired:true,sit:true,size:15});
      sketch([[760,565],[900,525],[1080,590],[1110,520],[980,485],[780,520]],prog(t,0,.8),310,{stroke:HD.muted,strokeWidth:2});
      foot('잠깐. 나는 어떤 개발자이고 싶지?');
      if(t>2.5)paperTear(prog(t,2.5,3),HD.dark);
    }],
    [7,10,t=>{
      hdDark();
      text('나를 돌아보는 시간',W/2,260,{font:HD.serif,size:38,color:HD.light,jit:false,alpha:prog(t,0,.4)});
      wordmark(480,180,prog(t,.15,1.2),HD.light);
      text('대화 속에서, 나를 발견하다.',W/2,675,{font:HD.script,size:60,color:'#b9d5ca',jit:false,alpha:prog(t,.8,1.3)});
      dev(W/2,965,t,{size:10});
    }],
    [10,15,t=>{
      hdPaper();tag('내가 고르는 주제');
      title(['남의 속도 말고,','나의 기준을.'],150,{size:82,p:t});
      horizon(870);dev(385,870,t,{size:13});
      note(720,435,750,310,'무엇을 알아가고 싶은가요?',['나의 습관','나의 가치관','나의 일하는 방식'],t,410);
      ['습관','가치관','일하는방식'].forEach((label,i)=>{
        const p=prog(t,.7+i*.4,1.2+i*.4);
        sketch([[1300,520+i*56],[1312,532+i*56],[1340,503+i*56]],p,430+i,{stroke:HD.accent,strokeWidth:4});
      });
      text('기본 프롬프트 → 나의 프롬프트',1100,815,{font:HD.script,size:40,color:HD.accent,jit:false,alpha:prog(t,1.8,2.4)});
      foot('/find-me:setup');
    }],
    [15,20,t=>{
      hdPaper();tag('대화에서 발견한 나');
      title(['나는 바꾸기 전에,','이유부터 이해하고 싶다.'],135,{size:78,p:t});
      horizon(895);dev(285,895,t,{size:11});
      note(580,420,570,275,'발견',['변경에 앞서 이유와 범위를','먼저 이해하려는 모습이 보인다.'],t,510);
      note(1220,420,570,275,'대화 맥락',['패치 전에 변경 범위를','설명해 달라고 요청했다.'],t-.45,520);
      arrow([[1165,560],[1187,556],[1205,560]],prog(t,.8,1.4),530,{stroke:HD.accent,strokeWidth:3});
      text('나의 말이, 나를 이해하는 단서가 된다.',1170,795,{font:HD.script,size:42,color:HD.accent,jit:false,alpha:prog(t,1.1,1.7)});
      foot('/find-me:write-record');
    }],
    [20,24,t=>{
      hdPaper();tag('내 방식으로 다듬기');
      title(['“너무 추상적이야.”','“내가 한 말을 더 담아줘.”'],135,{size:78,p:t});
      horizon(880);dev(470,880,t,{size:13});
      note(820,445,850,270,'내 피드백으로 바뀌는 개인 프롬프트',['발견은 한 문장으로.','맥락에는 내가 실제로 한 요구를.'],t,610);
      sketch([[848,565],[1030,568],[1205,563]],prog(t,.8,1.5),630,{stroke:HD.accent,strokeWidth:4});
      text('다음 기록부터, 내 방식으로.',1230,805,{font:HD.script,size:46,color:HD.accent,jit:false,alpha:prog(t,1.2,1.8)});
      foot('/find-me:fix-record');
      if(t>3.4)paperTear(prog(t,3.4,4),HD.accent);
    }],
    [24,27,t=>{
      ctx.fillStyle=HD.accent;ctx.fillRect(0,0,W,H);
      title(['나를 알수록,','나의 방향이 보인다.'],160,{size:90,color:HD.light,p:t});
      sketch([[260,905],[670,905],[670,835],[1060,835],[1060,755],[1570,755]],1,710,{stroke:HD.light,strokeWidth:3,roughness:.7});
      [['나의 습관',470,955],['나의 기준',870,890],['나의 속도',1370,810]].forEach(([label,x,y],i)=>text(label,x,y,{font:HD.script,size:36,color:HD.light,jit:false,alpha:prog(t,i*.4,i*.4+.5)}));
      const [x,y]=camKeys(t,[[0,370,905],[.6,580,905],[1,730,835],[1.6,950,835],[2,1120,755],[2.7,1480,755]]);
      dev(x,y,t,{size:12,walk:true});
    }],
    [27,30,t=>{
      hdPaper();
      text('남의 속도를 쫓던 내가,',W/2,165,{font:HD.serif,size:64,jit:false,alpha:prog(t,0,.4)});
      text('나의 방향을 찾는다.',W/2,275,{font:HD.serif,size:78,color:HD.accent,jit:false,alpha:prog(t,.15,.6)});
      wordmark(495,140,prog(t,.1,.9));
      text('Claude Code · Codex',W/2,655,{font:HD.sans,size:30,jit:false,alpha:prog(t,.5,.9)});
      text('github.com/Changroro/find-me',W/2,722,{font:HD.mono,size:30,color:HD.accent,jit:false,alpha:prog(t,.7,1.1)});
      horizon(925);dev(lerp(510,690,E.out(prog(t,0,2.3))),925,t,{size:10,walk:t<2.3});cloud(1510,845,.5,910);
      text('손그림 스타일 참고: @nahiddotai',W-70,H-37,{font:HD.sans,size:18,color:HD.muted,align:'right',jit:false});
    }]
  ]
});
