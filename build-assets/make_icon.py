from PIL import Image, ImageDraw, ImageFont
import os
root=r"D:\99356\Documents\deepseek-harness\default-workspace\kpl-bp-studio"
img=Image.new("RGBA",(256,256),(8,12,20,255))
d=ImageDraw.Draw(img)
d.rounded_rectangle((10,10,246,246), radius=44, outline=(232,185,104,255), width=6, fill=(13,19,31,255))
try:
    font=ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 86)
    small=ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 28)
except Exception:
    font=ImageFont.load_default()
    small=font
d.text((128,105),"BP",font=font,anchor="mm",fill=(232,185,104,255))
d.text((128,184),"KPL STUDIO",font=small,anchor="mm",fill=(190,205,225,255))
out=os.path.join(root,"build-assets")
os.makedirs(out,exist_ok=True)
img.save(os.path.join(out,"kpl-bp.ico"), sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
print(os.path.join(out,"kpl-bp.ico"))
