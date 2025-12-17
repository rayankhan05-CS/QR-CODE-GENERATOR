let qr;
const analyticsKey = "ultimate_qr_analytics";

const $ = id => document.getElementById(id);

function toggleTheme(){
  const root = document.documentElement;
  root.toggleAttribute("data-theme");
}

async function generateQR(){
  const text = $("text").value.trim();
  if(!text) return alert("Enter text or URL");

  $("qrcode").innerHTML = "";

  qr = new QRCodeStyling({
    width: 270,
    height: 270,
    data: text,
    qrOptions:{ errorCorrectionLevel:"H" },
    dotsOptions:{ color:$("dotsColor").value },
    backgroundOptions:{ color:$("bgColor").value }
  });

  qr.append($("qrcode"));
  saveAnalytics("views");
}

async function downloadQR(){
  if(!qr) return alert("Generate QR first");
  const blob = await qr.getRawData("png");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "qr-code.png";
  a.click();
  saveAnalytics("downloads");
}

function saveAnalytics(type){
  const data = JSON.parse(localStorage.getItem(analyticsKey) || "{}");
  data[type] = (data[type] || 0) + 1;
  localStorage.setItem(analyticsKey, JSON.stringify(data));
}

function setStyle(style){
  document.getElementById("designPreset").value = style;
  generateQR();
}

function copyAsImage(){
  const canvas = document.querySelector("#qrcode canvas");
  canvas.toBlob(blob=>{
    navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
  });
}
