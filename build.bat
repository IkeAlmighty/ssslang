tar.exe -cvf .\nwjs-v0.89.0-win-x64\ssslang.zip package.json ssslang.js

mv ssslang.zip ssslang.nw

cd .\nwjs-v0.89.0-win-x64\

del ssslang.exe
copy /b nw.exe+ssslang.nw ssslang.exe