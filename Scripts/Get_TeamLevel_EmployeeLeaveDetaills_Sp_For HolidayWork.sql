
    --exec Get_TeamLevel_EmployeeLeaveDetaills_Sp @EMPCODE=N'3006',@Year=N'2018',@TeamId=3,@Month=N''        
/*           1112        
1089        
1067    
    
Use EDSAPPDB    
GO        
 EXEC [Get_TeamLevel_EmployeeLeaveDetaills_Sp] '1259','2018',12          
 Use EDSAPPREGDB    
GO        
 EXEC [##Get_TeamLevel_EmployeeLeaveDetaills_Sp] '1259','2018',1        
*/            
 ALTER PROCEDURE [dbo].[Get_TeamLevel_EmployeeLeaveDetaills_Sp] (            
 @EMPCODE VARCHAR(50),            
 @Year VARCHAR(4) = NULL,            
 @TeamId INT = 0,          
 @Month Varchar(100) = null              
            
 )            
AS            
BEGIN            
 --Declare @EMPCODE VARCHAR(50)='1259',               
 --@Year    VARCHAR(4)=NULL,              
 --@TeamId Int = 0,        
 --@Month Varchar(100) = null              
 DECLARE @EMPID INT = 0            
 DECLARE @YearBit BIT = 0            
 DECLARE @EMPTEAMID INT = 0            
 DECLARE @SearchTEAMID Nvarchar(max)=''        
 DECLARE @MonthBit BIT = 0          
 Declare @CompanyWorkingHrs decimal(8,2)
 
 select @CompanyWorkingHrs= convert(decimal(8,2),isnull(char1,0)) 
 from CodeMaster where Module='TimeSheet'	and Class='MonthEndProcess' and	FieldName='WorkingHours'  
 
 IF (Len(@Year) > 0)            
  SET @YearBit = 1            
 ELSE            
  SET @YearBit = 0            
            
 If(Len(@Month)>0) Set @MonthBit=1  else  Set @MonthBit=0              
          
 IF (            
   @Year = 'ALL'            
   AND @YearBit = 1            
   )            
  SET @YearBit = 0           
   IF(@Month='ALL' AND @MonthBit=1) Set @MonthBit=0               
            
 SELECT @EMPID = empid            
 FROM employee_master WITH (NOLOCK)            
 WHERE empcode = @EMPCODE            
            
 --DECLARE @EMPID INT=1                   
 DECLARE @LEVEL INT = 0            
 DECLARE @EMPTYPEID INT = 0            
            
 SELECT @LEVEL = ET.[Hierarchy],            
  @EMPTEAMID = EMPTEAMID,            
  @EMPTYPEID = E.emptypeid            
 FROM employee_master E WITH (NOLOCK)            
 INNER JOIN employeetype_master ET WITH (NOLOCK)            
  ON ET.emptypeid = E.emptypeid            
 --INNER JOIN team_hierarchy TH WITH (NOLOCK)            
 -- ON TH.leadid = E.empid            
 WHERE empid = @EMPID            
            
 IF (            
   (@TeamID > 0)            
   AND (@TeamID = @EMPTEAMID)            
   AND @LEVEL in (1,2)            
   )              
   SET @SearchTEAMID = @TeamId        
 ELSE IF (            
   (@TeamID > 0)            
   AND @LEVEL > 2            
   )            
   SET @SearchTEAMID = @TeamId         
 ELSE IF (@TeamID = 0)            
  SET @SearchTEAMID = @EMPTEAMID            
    ELSE         
    SET @SearchTEAMID = @TeamId        
            
        
 IF (@LEVEL in(1,2))            
 BEGIN            
  SELECT empname,            
   Isnull([casual leave], 0) AS CasualLeave,            
   Isnull([comp off leave], 0) AS CompoffLeave,            
   Isnull([sick leave], 0) AS SickLeave,            
   Isnull([permissions], 0) AS Permission,            
   Isnull([Wedding Leave], 0) AS WeddingLeave,            
   ISNULL([Holiday Work], 0) + Isnull([Extended Hours],0) AS HolidayWork,            
   ISNULL([Holiday Leave], 0) AS HolidayLeave,            
   ISNULL([Work From Home], 0) AS WorkFromHome,        
   ISNULL([Extended Hours],0) AS ExtendedHours,        
   ISNULL([Consecutive Leave],0) AS ConsecutiveLeave,        
   Isnull([casual leave], 0) + Isnull([sick leave], 0) + Isnull([Wedding Leave], 0) + ISNULL([Holiday Leave], 0) AS [TotalLeaves]            
  FROM (            
   SELECT EM.EMPName,            
    Datename(year, leavefromdate) AS [YEARS],            
    LT.leavetype,            
    CASE             
     WHEN LT.LeaveTypeID = 4            
      THEN convert(DECIMAL(10, 2), Sum(convert(DECIMAL(10, 2), Duration)) / @CompanyWorkingHrs)         
      WHEN LT.LeaveTypeID = 9            
      THEN convert(DECIMAL(10, 2), Sum(convert(DECIMAL(10, 2), DurationInHours)) / @CompanyWorkingHrs)  + Sum(convert(DECIMAL(10, 2), Duration))             
     ELSE Sum(Duration)            
     END AS LeaveTakenday            
   FROM leavedetail LD            
   INNER JOIN leavetype_master LT            
    ON LD.leavetypeid = LT.leavetypeid            
   INNER JOIN employee_master EM            
    ON LD.empid = EM.empid            
   WHERE leavestatusid = '2'            
    AND empteamid IN(Select distinct Colvalue From PrepareTableFromArray_FN(@SearchTEAMID))            
    AND EM.emptypeid <= @EMPTYPEID      
    AND EM.IsActive=1            
    AND (            
     @YearBit = 0            
     OR (            
      @YearBit = 1            
      AND Datename(year, leavefromdate) = @Year            
      )            
     )            
     AND (@MonthBit=0 OR (@MonthBit=1 AND LEFT(Datename(MONTH, leavefromdate),3)=@Month))                         
          
   GROUP BY EM.empname,            
    Datename(year, leavefromdate),            
    LT.leavetype,            
    LT.LeaveTypeID            
   ) src           
  PIVOT(Sum(leavetakenday) FOR leavetype IN (            
     [Casual Leave],            
     [Comp Off Leave],            
     [Sick Leave],            
     [Permissions],            
     [Wedding Leave],            
     [Holiday Work],            
     [Holiday Leave],            
     [Work From Home],        
  [Extended Hours],        
  [Consecutive Leave]            
     )) piv;            
 END            
 ELSE IF (@LEVEL > 2)            
 BEGIN            
  SELECT empname,            
   Isnull([casual leave], 0) AS CasualLeave,            
   Isnull([comp off leave], 0) AS CompoffLeave,            
   Isnull([sick leave], 0) AS SickLeave,            
   Isnull([permissions], 0) AS Permission,            
   Isnull([Wedding Leave], 0) AS WeddingLeave,            
   ISNULL([Holiday Work], 0) AS HolidayWork,            
   ISNULL([Holiday Leave], 0) AS HolidayLeave,            
   ISNULL([Work From Home], 0) AS WorkFromHome,        
   ISNULL([Extended Hours],0) AS ExtendedHours,        
   ISNULL([Consecutive Leave],0) AS ConsecutiveLeave,        
   Isnull([casual leave], 0) + Isnull([sick leave], 0) + Isnull([Wedding Leave], 0) + ISNULL([Holiday Leave], 0) AS [TotalLeaves]            
  FROM (            
   SELECT EM.EMPName,            
    Datename(year, leavefromdate) AS [YEARS],            
    LT.leavetype,            
    CASE             
     WHEN LT.LeaveTypeID = 4            
      THEN convert(DECIMAL(10, 2), Sum(convert(DECIMAL(10, 2), Duration)) / @CompanyWorkingHrs)            
     WHEN LT.LeaveTypeID = 9            
      THEN convert(DECIMAL(10, 2), Sum(convert(DECIMAL(10, 2), DurationInHours)) / @CompanyWorkingHrs)  + Sum(convert(DECIMAL(10, 2), Duration))             
     ELSE Sum(Duration)            
     END AS LeaveTakenday            
   FROM leavedetail LD            
   INNER JOIN leavetype_master LT            
    ON LD.leavetypeid = LT.leavetypeid            
   INNER JOIN employee_master EM            
    ON LD.empid = EM.empid            
   WHERE leavestatusid = '2'            
    AND empteamid IN(Select distinct Colvalue From PrepareTableFromArray_FN(@SearchTEAMID))            
    --AND EM.emptypeid <= @EMPTYPEID       
    AND EM.IsActive=1           
    AND (            
     @YearBit = 0            
     OR (            
      @YearBit = 1            
      AND Datename(year, leavefromdate) = @Year            
      )            
     )            
         AND (@MonthBit=0 OR (@MonthBit=1 AND LEFT(Datename(MONTH, leavefromdate),3)=@Month))                         
          
   GROUP BY EM.empname,            
    Datename(year, leavefromdate),            
    LT.leavetype,            
    LT.LeaveTypeID            
   ) src            
  PIVOT(Sum(leavetakenday) FOR leavetype IN (            
     [Casual Leave],            
     [Comp Off Leave],            
     [Sick Leave],            
     [Permissions],            
     [Wedding Leave],            
     [Holiday Work],            
     [Holiday Leave],            
     [Work From Home],        
  [Extended Hours],        
  [Consecutive Leave]        
     )) piv;            
 END            
END