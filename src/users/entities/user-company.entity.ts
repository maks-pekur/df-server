import { Company } from 'src/companies/entities/company.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userCompanies)
  user: User;

  @ManyToOne(() => Company, (company) => company.userCompanies)
  company: Company;

  @ManyToOne(() => Role, (role) => role.userCompanies)
  role: Role;

  @Column({ nullable: true })
  storeId: number;
}
