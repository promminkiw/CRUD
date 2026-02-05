import { Injectable, NotFoundException } from '@nestjs/common';
import { getFirestore } from '../config/firebase';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  private col = getFirestore().collection('users');

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const now = Date.now();
    const docRef = this.col.doc(); // auto id

    const data: Omit<UserEntity, 'id'> = {
      email: dto.email,
      displayName: dto.displayName,
      role: dto.role ?? 'user',
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(data);

    return { id: docRef.id, ...data };
  }

  async findAll(): Promise<UserEntity[]> {
    const snap = await this.col.orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  }

  async findOne(id: string): Promise<UserEntity> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) throw new NotFoundException('User not found');
    return { id: doc.id, ...(doc.data() as any) };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const ref = this.col.doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException('User not found');

    const now = Date.now();
    await ref.update({
      ...dto,
      updatedAt: now,
    });

    const updated = await ref.get();
    return { id: updated.id, ...(updated.data() as any) };
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const ref = this.col.doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException('User not found');

    await ref.delete();
    return { id, deleted: true };
  }
}
