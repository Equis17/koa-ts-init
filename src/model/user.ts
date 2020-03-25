import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table(
  {
    modelName: 'users',
    timestamps: false,
  })
export default class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  public id: number;

  @Column(DataType.CHAR)
  public name: string;
}
