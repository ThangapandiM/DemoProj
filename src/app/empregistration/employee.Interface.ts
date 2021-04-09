export interface IEmployee {
    EMPName: string;
    EMPTeamID: number;
    EMPCode: string;
    EMPPassword: string;
    EMPMobileNo: string;
    EMPEmailID: string;
    EMPDOB: string;
    EMPTypeID: number;
    EMPImgAttachment: string;
    EMPImgName: string;
    Gender: string;
    DateOfJoining: string;
    RoleID: string;
    EmployerID: string;
}
export interface IEmployeeResult {
    Status: string;
    Description: string;
    EMPID: number;
}


export class IEmployeeTypes {
    EMPTypeID: number;
    EMPType: string;
}
export class ITeam {
    TeamID: number;
    TeamName: string;
}

export class IRole {
    RoleID: number;
    RoleType: string;
}

export class IEmployer {
    EmployerID: number;
    Employer: string;
}