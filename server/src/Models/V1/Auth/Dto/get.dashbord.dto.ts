export class GetDashBoardResp {
  totalMember: number;
  memberShip: MemberShip[];
  gender: Gender;
  age: Age;
}

export class MemberShip {
  rate: string;
  count: number;
}
export class Gender {
  male: number;
  female: number;
  other: number;
}

export class Age {
  20: number;
  21: number;
  31: number;
  41: number;
  51: number;
  60: number;
}
