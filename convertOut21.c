#include <stdio.h>
#include <stdlib.h>
void closer(char* str,int *place){
    *(str+*place-4) = '\n';
    *(str+*place-3) = ']';
    *(str+*place-2) = ';';
    *(str+*place-1) = '\0';
}

int opener(char* str){
    char open[] = "var classes = [\n  ";
    char* ptr = str;
    int j = 0;
    int p = 0;
    while(open[p] != '\0'){
        *(ptr++) = open[p++];
        j++;
    }
    return j;
}

int main(){
    char *file0 = "monday.csv", *file1 = "tuesday.csv", *file2 = "wednesday.csv", *file3 = "thursday.csv";
    char** files = malloc(4*sizeof(char*));
    *files = file0;
    *(files+1) = file1;
    *(files+2) = file2;
    *(files+3) = file3;
    FILE* fp, *wfp;
    
    char* f0 = "{NAME:\"", *f1 = "\",DAY:\"", *f2 = "\",MIN_AGE:", *f3 = ",MAX_AGE:", *f4 = ", TEACHER:\"", *f5 = "\", ROOM:", *f6 = ",TYPE:\"", *f7 = "\", START_TIME:\"", *f8 = "\", END_TIME:\"", *f9 = "\"},\n  ", *f10 = "default";
    //char** fill = &[f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,f10];
    char** fill = malloc(11*sizeof(char*));
    *fill = f0;
    *(fill+1) = f1;
    *(fill+2) = f2;
    *(fill+3) = f3;
    *(fill+4) = f4;
    *(fill+5) = f5;
    *(fill+6) = f6;
    *(fill+7) = f7;
    *(fill+8) = f8;
    *(fill+9) = f9;
    *(fill+10) = f10;
    
    char* retval;
    int len = 100000;
    int place;
    retval = malloc(100000);
    retval[len-1] = 0;
    if(retval == NULL){
        fprintf(stderr,"Error: No memory left. Exiting...\n");
        return 1;
    }
    place = opener(retval);
    
    char* d0 = "monday"; char* d1 = "tuesday"; char* d2 = "wednesday"; char* d3 = "thursday";
    char** day = malloc(4*sizeof(char*));
    *day = d0; *(day+1) = d1; *(day+2) = d2; *(day+3) = d3;
    
    int i;
    for(i=0;i<4;i++){
        fp = fopen(files[i],"r");
        if(fp == NULL){
            fprintf(stderr,"The file you are trying to open does not exist.\n");
            return 1;
        }
        
        char ch;
        int inside = 0;
        char* entry = malloc(1000);
        char* e = entry;
        if(entry == NULL){
            fprintf(stderr,"Error: No memory left. Exiting...\n");
            return 1;
        }
        
        int rmNum = 0;
        // read in file character by character
        while((ch = fgetc(fp)) != EOF){
            // make sure it doesn't overflow
            if(len-place < 1000){
                len = len+len;
                char* temp = malloc(len);
                if(temp == NULL){
                    fprintf(stderr,"Error: No memory left. Exiting...\n");
                    return 1;
                }
                retval[place] = '\0';
                char* pl = retval;
                char* tpl = temp;
                // copy string over
                while(*pl != '\0'){
                    *(tpl++) = *(pl++);
                }
                temp[len-1] = 0;
                free(retval);
                retval = temp;
            }
            
            if(inside){
                *(e++) = ch;
                if(ch == '"'){
                    *e = '\0';
                    if((e-entry) >= 27){
                        e = entry;
                        char* r = retval+place;
                        //Name:
                        char* c = fill[0];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // class name
                        e++;
                        while(*e != '\n'){
                            *(r++) = *(e++);place++;
                        }e++;
                        // day:
                        c = fill[1];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // each day is a different sheet
                        c = day[i];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // min_age:
                        c = fill[2];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // age logic
                        while(*e != '(') e++;
                        e++;
                        switch (*e){
                            case('h'):
                            case('H'):
                                *(r++) = '1';place++;
                                *(r++) = '4';place++;
                                c = fill[3];
                                while(*c != 0){
                                    *(r++) = *(c++);place++;
                                }
                                *(r++) = '1';place++;
                                *(r++) = '8';place++;
                                break;
                            case('g'):
                                // find number
                                while(*e < '0' || *e > '9')e++;
                                // age from
                                // +6 because i'm trying to translate out of grade into age
                                *(r++) = *(e++);place++;
                                if(*e >= '0' && *e <= '9'){
                                    *(r++) = *(e++) + 6;place++;
                                    if(*(e-1) > '9'){
                                        *(e-1) = *(e-1) - 10;
                                        *(e-2) = *(e-2) + 1;
                                    }
                                }else{
                                    if(*(e-1) > '9'){
                                        *(e) = *(e-1) - 10;
                                        *((e++)-1) = '1';
                                    }
                                }
                                // max_age:
                                c = fill[3];
                                while(*c != 0){
                                    *(r++) = *(c++);place++;
                                }
                                //age to
                                if(*e == '+' || *(e+1) == '+'){
                                    *(r++) = '1';place++;
                                    *(r++) = '9';place++;
                                }else{
                                    // find number
                                    while(*e < '0' || *e > '9')e++;
                                    // +6 because i'm trying to translate out of grade into age
                                    *(r++) = *(e++);place++;
                                    if(*e >= '0' && *e <= '9'){
                                        *(r++) = *(e++) + 6;place++;
                                        if(*(e-1) > '9'){
                                            *(e-1) = *(e-1) - 10;
                                            *(e-2) = *(e-2) + 1;
                                        }
                                    }else{
                                        if(*(e-1) > '9'){
                                            *(e) = *(e-1) - 10;
                                            *((e++)-1) = '1';
                                        }
                                    }
                                }
                                
                                break;
                            case('a'):
                                // find number
                                while(*e < '0' || *e > '9')e++;
                                // age from
                                *(r++) = *(e++);place++;
                                if(*e >= '0' && *e <= '9'){
                                    *(r++) = *(e++);place++;
                                }
                                // max_age:
                                c = fill[3];
                                while(*c != 0){
                                    *(r++) = *(c++);place++;
                                }
                                //age to
                                if(*e == '+' || *(e+1) == '+'){
                                    *(r++) = '1';place++;
                                    *(r++) = '9';place++;
                                }else{
                                    // find number
                                    while(*e < '0' || *e > '9')e++;
                                    *(r++) = *(e++);place++;
                                    if(*e >= '0' && *e <= '9'){
                                        *(r++) = *(e++);place++;
                                    }
                                }
                                break;
                            default:
                                *(r++) = '-';place++;
                                *(r++) = '1';place++;
                                c = fill[3];
                                while(*c != 0){
                                    *(r++) = *(c++);place++;
                                }
                                *(r++) = '-';place++;
                                *(r++) = '1';place++;
                        }
                        while(*e != '\n') e++;
                        e++;
                        // teacher:
                        c = fill[4];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // teacher name, everything until \n
                        while(*e != '\n'){
                            *(r++) = *(e++);place++;
                        }e++;
                        //room:
                        c = fill[5];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // room number
                        if(rmNum < 10){
                            *(r++) = '0' + rmNum;place++;
                        }else{
                            *(r++) = '0' + (rmNum/10);place++;
                            *(r++) = '0' + (rmNum%10);place++;
                        }
                        // type:
                        c = fill[6];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // type of class
                        c = fill[10];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // start time:
                        c = fill[7];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // time decode
                        while(*e < '0' || *e > '9')e++;
                        // first number
                        *(r++) = *(e++);place++;
                        if(*e >= '0' && *e <= '9') {*(r++) = *(e++);place++;}
                        if(*e == ':'){
                            // if it's : then the next two must be numbers also
                            *(r++) = *(e++);place++;
                            *(r++) = *(e++);place++;
                            *(r++) = *(e++);place++;
                        }
                        // end time:
                        c = fill[8];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                        // time decode
                        while(*e < '0' || *e > '9')e++;
                        // second number
                        *(r++) = *(e++);place++;
                        if(*e >= '0' && *e <= '9') {*(r++) = *(e++);place++;}
                        if(*e == ':'){
                            // if it's : then the next two must be numbers also
                            *(r++) = *(e++);place++;
                            *(r++) = *(e++);place++;
                            *(r++) = *(e++);place++;
                        }
                        // close brackets
                        c = fill[9];
                        while(*c != 0){
                            *(r++) = *(c++);place++;
                        }
                    }
                    inside = 0;
                    e = entry;
                }
            }else{
                if(ch == '"'){
                    inside = 1;
                    *(e++) = ch;
                }else if(ch == ','){
                    rmNum++;
                    if(rmNum == 7) rmNum++;
                }else if(ch == '\n'){
                    rmNum = 0;
                }
            }
        }
        fclose(fp);
    }
    // make sure it doesn't overflow
    if(len-place < 1000){
        len = len+len;
        char* temp = malloc(len);
        if(temp == NULL){
            fprintf(stderr,"Error: No memory left. Exiting...\n");
            return 1;
        }
        retval[place] = '\0';
        char* pl = retval;
        char* tpl = temp;
        // copy string over
        while(*pl != '\0'){
            *(tpl++) = *(pl++);
        }
        temp[len-1] = 0;
        free(retval);
        retval = temp;
    }
    
    closer(retval, &place);
    //printf("%s~~",retval);
    // write to
    wfp = fopen("schedule.js","w");
    if(wfp == NULL){
        fprintf(stderr,"The file you are trying to open does not exist.\n");
        return 1;
    }
    fprintf(wfp,"%s\n",retval);
    fclose(wfp);
}