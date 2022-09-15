import { Exclude, Expose } from "class-transformer"
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { makeId } from "../utils/helpers"
import BaseEntity from "./Entity"
import Post from "./Post"
import { User } from "./User"
import Vote from "./Vote"
@Entity("comments")
export default class extends BaseEntity {
    @Index()
    @Column()
    identifier: string

    @Column()
    body: string
    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User

    @Column()
    postId: number

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    post: Post

    @Exclude()
    @OneToMany(() => Vote, (Vote) => Vote.comment)
    votes: Vote[]

    protected userVote: number

    setUserVote(user: User) {
        const index = this.votes?.findIndex((v) => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
    }

    @Expose() get voteScore(): number {
        const initialValue = 0
        return this.votes?.reduce((previousValue, currentObject) =>
            previousValue + (currentObject.value || 0), initialValue)
    }

    @BeforeInsert()
    makeId() {
        this.identifier = makeId(8)
    }


}
