import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ name: 'kakao_id', type: 'bigint', unique: true, nullable: true })
    kakaoId: string | null;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string | null; // bcrypt 해시값 저장

    @Column({ type: 'varchar', length: 100 })
    nickname: string;

    @Column({ name: 'profile_image', type: 'varchar', length: 500, nullable: true })
    profileImage: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt: Date | null;

}