import moment = require('moment-timezone');

export class MealPeriodEntity {
  ID: number;
  Meal_Period_Name: string;
  Meal_Period_ID: any;
  Create_ID: string;
  Alter_ID: string;

  constructor(body) {
    this.ID = body?.id;
    this.Meal_Period_Name = body?.mealPeriodName;
    this.Meal_Period_ID = body?.mealPeriodId;
    this.Create_ID = body?.iam?.authMemberId ?? '';
    this.Alter_ID = body?.iam?.authMemberId ?? '';
  }

  insertEntity() {
    return {
      Meal_Period_Name: this.Meal_Period_Name,
      Meal_Period_ID: this.Meal_Period_ID,
      Create_ID: this.Create_ID,
      Alter_ID: this.Alter_ID
    };
  }

  updateEntity() {
    return {
      ID: this.ID,
      Meal_Period_Name: this.Meal_Period_Name,
      Meal_Period_ID: this.Meal_Period_ID,
      Alter_ID: this.Alter_ID ?? '',
      Alter_Date: moment().utc().format('YYYY-MM-DD HH:mm:ss')
    };
  }

  deleteEntity() {
    return {
      ID: this.ID,
      IS_Active: 0,
      Alter_ID: this.Alter_ID
    };
  }
}
