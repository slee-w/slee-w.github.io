PROC IMPORT OUT= WORK.princ 
            DATAFILE= "K:\MAVISTA\03.02 Analysis\2017 DS Tables\MA_VISTA_Descriptive_Statistics.xlsx" 
            DBMS=EXCEL REPLACE;
     RANGE="Principal_Schl_Wts_Wide"; 
     GETNAMES=YES;
     MIXED=NO;
     SCANTEXT=YES;
     USEDATE=YES;
     SCANTIME=YES;
RUN;

proc contents data=princ order=varnum;
run;


* check for flags;
proc print data=princ;
where SubPopVar = "All" & ( Flag_Item = "Y" | Flag_Item = "Y");
run;

data princ2 (keep = Section Number Matrix_Text Item_Text Response EstType Estimate CI Item_N );

* specify order of columns in output data set;
retain Section Number Matrix_Text Item_Text Response EstType Estimate CI Item_N;

set princ (rename = (Var_name = Number Matrix_prompt = Matrix_Text Item_text = Item_Text ResponseCategory = Response Item_N = Item_N_Num));

* keep only SubPopVar = All;
if SubPopVar ne "All" then delete;

if substr(Number,1,1)="C" then Section = "EDUCATOR EVALUATION";


* create 4 new columns so that data for all types of items can appear in the same columns;
length EstType $7;

if WeightedPctEstimate ne . then do;
  EstType = "Percent";
  Estimate = round(WeightedPctEstimate);
  CI_Lower_Bound = round(WeightedPctCILowerBound);
  CI_Upper_Bound = round(WeightedPctCIUpperBound);
  end;

else if WeightedMean ne . then do;
  EstType = "Mean";
  Estimate = round(WeightedMean);
  CI_Lower_Bound = round(WeightedMeanCILowerBound);
  CI_Upper_Bound = round(WeightedMeanCIUpperBound);
  end;

* create single CI (text) field;
length CI_Low $3;
length CI_Up $3;
if CI_Lower_Bound ne . then CI_Low = CI_Lower_Bound;
if CI_Upper_Bound ne . then CI_Up = CI_Upper_Bound;
CI = strip(CI_Low)||"-"||strip(CI_Up);


length Item_N $10;
if Item_N_Num ne . then Item_N = Item_N_Num;
else if Item_N_Num = . then Item_N = "N/A";

* have to set blank cells to "N/A" so that cells don't get dropped when pasting into Word;
if Matrix_Text = "" then Matrix_Text = "N/A";
if Response = "" then Response = "N/A"; /* does this only work for SubPopVar = All ? */

* delete rows not needed for appendix table;
if Value in ("(missing)","-1") then delete;
if Value = "0" & Type in("Yes/No","Yes/No2") then delete;
if EstType = "Mean" & Type ne "Continuous" then delete;



run;




proc contents data=princ2 order=varnum;
run;



data table1 table2 table3 table4 table5 table6;
set princ2;
if Section="DEMOGRAPHICS" then output table1;
else if Section="STATE CURRICULUM FRAMEWORKS" then output table2;
else if Section="EDUCATOR GROWTH AND DEVELOPMENT" then output table3;
else if Section="EDUCATOR EVALUATION" then output table4;
else if Section="SOCIAL and EMOTIONAL LEARNING" then output table5;
else if Section="ESE OVERALL SUPPORT" then output table6;
run;


PROC EXPORT DATA= WORK.table1 
            OUTFILE= "K:\MAVISTA\04 Reports\2017 Reports\Comprehensive Reports\Statewide\Principal\Final\data for appendix.xlsx" 
            DBMS=EXCEL REPLACE;
     SHEET="table1"; 
RUN;

PROC EXPORT DATA= WORK.table2 
            OUTFILE= "K:\MAVISTA\04 Reports\2017 Reports\Comprehensive Reports\Statewide\Principal\Final\data for appendix.xlsx" 
            DBMS=EXCEL REPLACE;
     SHEET="table2"; 
RUN;

PROC EXPORT DATA= WORK.table3 
            OUTFILE= "K:\MAVISTA\04 Reports\2017 Reports\Comprehensive Reports\Statewide\Principal\Final\data for appendix.xlsx" 
            DBMS=EXCEL REPLACE;
     SHEET="table3"; 
RUN;

PROC EXPORT DATA= WORK.table4 
            OUTFILE= "K:\MAVISTA\04 Reports\2017 Reports\Comprehensive Reports\Statewide\Principal\Final\data for appendix.xlsx" 
            DBMS=EXCEL REPLACE;
     SHEET="table4"; 
RUN;

PROC EXPORT DATA= WORK.table5 
            OUTFILE= "K:\MAVISTA\04 Reports\2017 Reports\Comprehensive Reports\Statewide\Principal\Final\data for appendix.xlsx" 
            DBMS=EXCEL REPLACE;
     SHEET="table5"; 
RUN;

PROC EXPORT DATA= WORK.table6 
            OUTFILE= "K:\MAVISTA\04 Reports\2017 Reports\Comprehensive Reports\Statewide\Principal\Final\data for appendix.xlsx" 
            DBMS=EXCEL REPLACE;
     SHEET="table6"; 
RUN;
