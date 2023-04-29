
let conU = Vars.content.units();
let tmpU;
let pays = [];
for(let i = 0; i < conU.size; ++i){
  tmpU = conU.get(i);
  if(tmpU.sample instanceof Payloadc){
    pays.push({type: tmpU, cap: tmpU.payloadCapacity});
  }
}
let unlimit = function(){
  for(let i of pays){
    i.type.payloadCapacity = Infinity;
  }
}
let limit = function(){
  for(let i of pays){
    i.type.payloadCapacity = i.cap;
  }
}
unlimit();

let getIp = global.svn.util.getIp;
let getPort = global.svn.util.getPort;
let darkServer = function(){
  return getIp() == "130.61.76.9";
}
let darkCrawler = function(){
  return getIp() == "130.61.76.9" &&  getPort() == 5000; // "130.61.76.9:5000"
}
let QuickChat = global.svn.qc.QuickChat;
tbl && tbl.remove();
let hg = Vars.ui.hudGroup;
let qc = new QuickChat(50, 2, "svn-command-support");
let sz = 50;
let tbl = qc.tbl;
let cmdHelp = qc.add("?", "/help");
let cmdSync = qc.add(Icon.refresh, "/sync");
let cmdPlayers = qc.add(Icon.players, "/players", ()=>darkServer());
let cmdMaps = qc.add(Icon.map, "/maps", ()=>darkServer());
let cmdStats = qc.add(Icon.paste, "/stats", ()=>darkServer());
let cmdSettings = qc.add(Icon.settings, "/settings", ()=>darkServer());
let cmdUpgrade = qc.add(Icon.units, "/upgrade", ()=>darkCrawler());
hg.addChild(tbl);
hg.pack();
tbl.setPosition(0, 500);
tbl.pack();

let PayCtrl = global.svn.payloadc.PayCtrl;
let pup = function(){
  let u = Vars.player;
  let ph = new PayCtrl(u, 32);/*
  ph.update(t=>{
    let nu = Vars.player.unit();
    if(u != nu){
      t.unit(nu);
      Log.info("change unit: " + u + " to " + nu);
      u = nu;
    }
  });*/
  ph.run();
  ph.end();
  ph.run(); // hehehe
  return ph;
}
ph && typeof ph.end == "function" && ph.end();
let ph = pup();
let pupTbl = ph.tbl;
hg.addChild(pupTbl);
pupTbl.setPosition(0, 450);
pupTbl.pack();

let ibs = new ImageButton.ImageButtonStyle(Icon.upOpen, null, Icon.downOpen, null, null, null);
let cat = function(tt, seq, clk, ipr){
  let tbl = new Table(Styles.black5), top = new Table(Styles.black8), bot = new Table(Styles.black9);
  let cls = new Collapser(bot, true);
  let lbl, tog ;
  let cnt, i, tmp, tmp2;
  if(!(tt instanceof Element)){
    tt = new Label(tt.toString());
  }
  tbl.add(top).height(50).growX();
  tbl.row();
  tbl.add(cls).growX();
  lbl = top.add(tt).left().height(50).growX().get();
  tog = new ImageButton(ibs);
  top.add(tog).right().size(50);
  if(!(seq instanceof Seq)){
    tmp = seq, seq = new Seq();
    if(typeof tmp == "string" || tmp instanceof Array){
      for(i = 0; i < tmp.length; ++i){
        seq.add(tmp[i]);
      }
    }
  }
  if(typeof clk != "function"){
    clk = ()=>{};
  }
  if(typeof ipr != "number" || ipr < 1){
    ipr = 12;
  }
  for(i = 0; i < seq.size; ++i){
    let ii = seq.get(i);
    bot.button(ii, Styles.flatBordert, ()=>{clk(ii)}).size(50);
    if((i + 1) % ipr == 0){
      bot.row();
    }
  }
  cls.setCollapsed(()=>!tog.isChecked());
  return tbl;
}

let msg, ed;
let chatEmojis = function(){
  ed = new BaseDialog("Emojis");
  const c = ed.cont, maxLen = Vars.maxTextLength;
  c.top();
  let t, scr, txt, idl, kbu, kbd, ipc, len, all, cut, cpy, pst, send, tmp, tmp2, col;
  let etbl, escr, ico, blk, uni, ite, liq;
  let txtc, emoc;
  txt = new TextArea("");
  txt.setMaxLength(maxLen);
  txt.setProgrammaticChangeEvents(true);
  txt.tapped(()=>{
    Core.input.setOnscreenKeyboardVisible(true);
  });
  idl = global.svn.util.field(txt, "inputDialogListener").val;
  txt.removeListener(idl);
  scr = c.pane(txt).top().height(100).growX().padLeft(6).padRight(6).get();
  scr.setScrollingDisabled(true, false);
  scr.setFadeScrollBars(false);
  c.row();
  t = c.table().top().growX().get();
  kbu = t.button(Icon.upOpen, ()=>{
    Core.input.setOnscreenKeyboardVisible(true);
  }).size(50).left().padLeft(6).get();
  kbd = t.button(Icon.downOpen, ()=>{
    Core.input.setOnscreenKeyboardVisible(false);
  }).size(50).left().padLeft(6).get();
  if(idl){
    ipc = t.check("System input", c=>{
      if(c){
        txt.addListener(idl);
      }else{
        txt.removeListener(idl);
        Core.input.setOnscreenKeyboardVisible(true);
      }
    }).height(50).left().padLeft(6).get();
  }
  len = t.add(new Label("")).height(50).growX().padRight(6).get();
  len.setAlignment(Align.right);
  all = t.button(Icon.move, ()=>{
    txt.selectAll();
  }).size(50).right().padRight(6).get();
  cut = t.button("Cut", ()=>{
    txt.cut();
  }).size(50).right().padRight(6).get();
  cpy = t.button(Icon.copy, ()=>{
    let t = txt.getSelection();
    if(!t || t == ""){
      t = txt.getText();
    }
    if(t && t != ""){
      Core.app.setClipboardText(t);
    }
  }).size(50).right().padRight(6).get();
  pst = t.button(Icon.paste, ()=>{
    txt.paste(Core.app.getClipboardText(), true);
  }).size(50).right().padRight(12).get();
  send = t.button(Icon.right, ()=>{
    let t = txt.getText();
    if(t && t != ""){
      Call.sendChatMessage(t);
      txt.clearText();
    }
  }).size(50).right().padRight(6).get();
  c.row();
  etbl = new Table();
  etbl.top();
  escr = c.pane(etbl).grow().height(Core.scene.height / 2).top().get();
  escr.setScrollingDisabled(true, false);
  emoc = t=>{
    txt.paste(t, true);
  }
  ico = etbl.add(cat("Icons", global.svn.const.emojiIcons, emoc)).expandX().top().get();
  etbl.row();
  blk = etbl.add(cat("Blocks", global.svn.const.emojiBlocks, emoc)).expandX().top().get();
  etbl.row();
  uni = etbl.add(cat("Units", global.svn.const.emojiUnits, emoc)).expandX().top().get();
  etbl.row();
  ite = etbl.add(cat("Items", global.svn.const.emojiItems, emoc)).expandX().top().get();
  etbl.row();
  liq = etbl.add(cat("Liquids", global.svn.const.emojiLiquids, emoc)).expandX().top().get();
  c.update(()=>{
    tmp = txt.getText().toString() == "";
    tmp2 = txt.getText() == txt.getSelection();
    all.setDisabled(tmp || tmp2);
    send.setDisabled(tmp);
    tmp = txt.getSelection() == "";
    cut.setDisabled(tmp);
    cpy.setDisabled(tmp);
    Core.scene.setKeyboardFocus(txt)
  });
  ed.addCloseButton();
  ed.closeOnBack();
  ed.setMovable(true);
  ed.setResizable(true);
  ed.setResizeBorder(20);
  ed.shown(()=>{
    Core.input.setOnscreenKeyboardVisible(true);
  });
  ed.hidden(()=>{
    msg = txt.getText().toString();
  });
  ed.show();
  txtc = ()=>{
    tmp = txt.getText().length;
    col = tmp / maxLen;
    col = "[" + (col == 1 ? "red" : col > 0.5 ? "yellow" : "green") + "]";
    len.setText(col + tmp + "/" + maxLen);
  };
  txt.changed(txtc);
  txt.setText(msg || "");
  txt.setCursorPosition(txt.getText().toString().length);
}
chatEmojis();






let ci = Vars.ui.hudGroup.find("coreinfo");
let cam = ci["find(arc.func.Boolf)"](e=>{
  return e instanceof Label && e.getText().indexOf("Money: [accent]") == 0;
});
let mon = -1, mtx;
if(cam){
  mtx = cam.getText().replace("Money: [accent]", "").replace(/,/gi, "");
  mon = Number(mtx);
}

let icons = function(ico, typ){
  let d = new BaseDialog("Icons");
  d.addCloseButton();
  let c = 0;
  let tbl = new Table();
  let x = d.cont;
  let lbl = x.add("name").fillX().height(30).get();
  let btn = x.button(Icon.copy, ()=>{
    Core.app.setClipboardText(lbl.getText());
  }).get();
  x.row();
  x.pane(tbl).fill();
  for(let i in ico){
    let ii = i;
    let val = ico[i];
    if(val instanceof typ){
      tbl.button(val, ()=>{
        lbl.setText("Icon." + ii);
      }).size(50).padLeft(6);
      ++c;
      if(c % 10 == 0 && c != 0){
        tbl.row();
      }
    }
  }
  d.show();
}
icons(Icon, Drawable);


let emoji = function(seq){
  let r = "";
  for(let i = 0; i < seq.size; ++i){
    r += seq.get(i).emoji();
  }
  return r;
}
emoji(Vars.content.blocks());

Vars.player.unit().payloads.get(0).build.rotation
Vars.player.unit().dropLastPayload()
Vars.control.input.payloadTarget = Vars.player.unit().core()// Vec2
Vars.control.input.tryDropPayload()
let p = Vars.player, u = p.unit();
while(u instanceof Payloadc && u.payloads.size > 0){
  Call.requestDropPayload(p, p.x + 240, p.y + 240);
}

let deg = 90; // degree
let rad = (deg % 360) * 2 * Math.PI / 360;
let [dx, dy] = [Math.cos(rad), Math.sin(rad)];
let p = Vars.player, u = p.unit(), pl = u.payloads, ts = Vars.tilesize, x = u.x, y = u.y;
while(pl.size > 0 && x >= 0 && y >= 0){
  Vars.control.input.payloadTarget = new Vec2(x, y),
  //Call.requestDropPayload(p, x, y);
  x += dx * ts;
  y += dy * ts;
}


// Unlock all
let cont = Vars.content;
let al = [cont.blocks(), cont.units(), cont.items(), cont.liquids()];
for(let i = 0; i < al.length; ++i){
  let il = al[i];
  for(let j = 0; j < il.size; ++j){
    let jl = il.get(j);
    if(jl == null){
      continue;
    }
    if(jl instanceof Block){
      if(jl.floor === false){
        jl.buildVisibility = BuildVisibility.shown;
      }
    }else{
      jl.hidden = false;
    }
  }
}


let blk = Blocks.foreshadow;
let blkSize = 100;
if(imgBtn) imgBtn.remove();
let ico = blk.drawer && blk.drawer.preview || blk.fullIcon || blk.displayIcon;
let imgBtn = new ImageButton(ico);
let img = imgBtn.getImage();
Vars.ui.hudGroup.addChild(imgBtn);
img.setRotationOrigin(0, Align.center);
imgBtn.clicked(()=>{
  let rt = (img.getRotation() + 90) % 360;
  img.setRotationOrigin(rt, Align.center);
});
imgBtn.addListener(extend(ElementGestureListener, {
  pan: function(e, x, y, dx, dy){
    const xc = imgBtn.width / 2, yc = imgBtn.height / 2,
    vec = new Vec2(x - xc, y - yc), ang = vec.angle();
    img.setRotationOrigin(ang - 90, Align.center);
  }
}));
imgBtn.resizeImage(blkSize);
imgBtn.setPosition(0, 400);
imgBtn.pack();






⚠

let icons = 
"26a0:warning,\
e800:checked,\
e801:openBook,\
e802:leftArrow,\
e803:rightArrow,\
e804:upArrow,\
e805:downArrow,\
e806:paused,\
e807:home,\
e808:picture,\
e809:starFive,\
e80b:resize,\
e80d:discord,\
e80e:logic,\
e80f:crank,\
e810:electric,\
e811:menu,\
e812:leftRightArrow,\
e813:plus,\
e814:conveyor,\
e815:cancel,\
e816:edit,\
e817:hammer,\
e818:move,\
e819:stats,\
e81a:outlinePlane,\
e81b:save,\
e81c:openLink,\
e81d:folder,\
e81e:box,\
e822:steam,\
e823:rotate,\
e824:openDown,\
e825:openLeft,\
e826:openUp,\
e827:map,\
e829:play,\
e82a:control,\
e82b:slash,\
e82c:bot,\
e82d:spray,\
e830:factory,\
e833:global,\
e835:undo,\
e836:redo,\
e837:info,\
e839:rightArrowOutline,\
e83a:rightArrow,\
e83b:wave,\
e83d:playOk,\
e83e:threeSlider,\
e83f:threeLayer,\
e842:upDownArrow,\
e844:resizeArrow,\
e845:android,\
e84c:fillColor,\
e84d:defendOutline,\
e852:paste,\
e853:core,\
e85b:papers,\
e85c:pipe,\
e85d:documents,\
e85e:drill,\
e85f:exit,\
e861:pvp,\
e864:sector,\
e865:attack,\
e867:refresh,\
e868:none,\
e869:pen,\
e86b:defend,\
e86c:,\
e86d:unit,\
e86e:attackBold,\
e86f:trashCan,\
e870:chatBubble,\
e871:turret,\
e872:player,\
e873:sector2,\
e874:copy,\
e875:techTree,\
e876:lockOpened,\
e877:pickColor,\
e878:openLink2,\
e879:download,\
e87b:upload,\
e87c:settings,\
e88a:search,\
e88b:,\
e88c:menu2,\
e88d:lockClosed,\
e88e:seen,\
e88f:unseen,\
f029:sharp,\
f0b0:filter,\
f0f6:whitePaper,\
f120:terminal,\
f129:infoWhite,\
f12d:eraser,\
f15b:blankPaper,\
f15c:textedPaper,\
f181:,\
f1c5:blankImage,\
f281:reddit,\
f300:github,\
f308:githubCat,\
";
let icos = icons.split(",").filter(v=>!!v);
icons = [];
let sp;
for(let i = 0; i < icos.length; ++i){
  sp = icos[i].split(":");
  icons.push({char: String.fromCharCode(Number.parseInt(sp[0], 16)), name: sp[1] || ""});
}
let ai = "";
for(let i = 0; i < icons.length; ++i){
  ai += icons[i].char;
}

let hg = Vars.ui.hudGroup;
let wg = new WidgetGroup();
wg.setFillParent(true);
wg.touchable = Touchable.disabled;
let tb = new Table(Styles.black3);
tb.setPosition(0, 800, Align.topLeft);
let tc = tb.add("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet ipsum molestie, imperdiet metus at, vestibulum justo. Quisque tincidunt pulvinar sapien et accumsan. Pellentesque faucibus sollicitudin massa, facilisis facilisis erat sodales at. Donec lacus enim, lacinia vel aliquet sit amet, vehicula molestie risus. Ut a hendrerit tellus. Maecenas sollicitudin.");
wg.addChild(tb);
hg.addChild(wg);
tc.style(Styles.outlineLabel).labelAlign(Align.topLeft).wrapLabel(true);
let t = tc.get();
let wrp = true;
tb.update(()=>{
  let p = Core.scene;
  if(p != null){
    let w = Core.scene.width * 2 / 3;
    t.width = w;
    t.setWrap(wrp);
    t.setEllipsis(!wrp);
    t.pack();
    let gw = t.getGlyphLayout().width;
    tc.width(gw < w ? gw : w);
    tb.pack();
  }
});


let [pu, pt, ut] = [Vars.player.unit(), Vars.player.team(), UnitTypes.latum];
let u = ut.spawn(pt, pu.x, pu.y);

let c = global.svn.cch.create(["cmd", "u", "t"], ["@#%", "@", "*"], ["1234", "1", "9"], ["xxx", "and or xor", "&& || !"]);
c.w.pack();
c.w.setPosition(0, 500);
Vars.ui.hudGroup.addChild(c.w);
CCH TYPES: boolean, number, string, date?, unit, block, item, liquid, player, team

ScriptableObject.defineClass(Vars.mods.getScripts().scope, Script, false, true);

let exe = function(s){
  let r;
  let script = Vars.mods.getScripts();
  let ctx = script.context, scp = script.scope;
  
  return ctx.evaluateString(scp, s, "svn-console.js", 1);
  
  try{
    let sc = ctx.compileString(s, "svn-console.js", 1);
    if(sc != null){
      r = sc.exec(ctx, scp);
    }
  }catch(e){
    Log.err("console exec: " + (e instanceof java.lang.Object) + " " + JSON.stringify(e));
  }
  return r;
}
exe("let x = 123;");

Return `Setting` value type for each `pref`methods.

Added return `Setting` type for these methods (instead of `void`):
- `CheckSetting checkPref()`.
- ~~`SliderSetting sliderPref()`.~~ Why these ones have return type and others not, before my PR?
- `TextSetting textPref()`.
- `AreaTextSetting areaTextPref()`.
- `Setting pref()`. Oh! For it, also!
- Optimized for calling overload methods.

---
- [X] I have read the [contribution guidelines](https://github.com/Anuken/Mindustry/blob/master/CONTRIBUTING.md).
- [ ] I have ensured that my code compiles, if applicable.
- [X] I have ensured that any new features in this PR function correctly in-game, if applicable.


@Anuken If i right, no Java mod will be break on startup.
Because no thing change on their call to these methods.
Before my PR (1):
```java
modSetings.checkPref("name", false); // return void
CheckSetting cs = modSetting.getSettings().get(modSetting.getSettings().size - 1); // assign it.
```
After my PR (2):
```java
modSetings.checkPref("name", false); // return CheckSetting, but no assignment, it's ok
CheckSetting cs = modSetting.getSettings().get(modSetting.getSettings().size - 1); // assign it. OK, also!
```
No installed mod need renew their codes.

---
For new mod can do this, instead of 2 lines as above (3):
```java
CheckSetting cs = modSetings.checkPref("name", false); // assign to a field
```
Ofcourse, if they use new mod style (3), on older game versions, it will be crashed.
Yep! This is not recommended! Up-to-date for better!