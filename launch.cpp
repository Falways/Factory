#include <iostream>
#include <fstream>
#include <direct.h>
#include <vector>

using namespace std;

bool isTargetExisted(string filePath){
    bool result = false;
    fstream _file;
    _file.open(filePath, ios::in);
    if(_file) {
        result = true;
    }
    return result;
}

int main() {
    cout << "launch SecAccess.exe ==> [start.exe SecAccess.exe] " << endl;
    char buff[1000];
    _getcwd(buff, 1000);
    char targetName [] = "\\SecAccess.exe";

    strcat(buff,targetName);
    cout << "current path: " << buff << endl;
    bool _result = isTargetExisted(buff);
    cout << "target isExisted: " <<(_result==true?"Y":"N") << endl;

    if (_result==true) {
        // launch target program.
        // string str = buff;
        // LPCSTR lpcstr = str.c_str();
        system(buff);
    }
    return 0;
}
