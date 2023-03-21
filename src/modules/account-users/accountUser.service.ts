import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
// import { Observable } from "rxjs";
import { Repository } from "typeorm";
import { AccountUserEntity } from "./accountUser.entity";
import { AccountUserDto} from "./create-accountUser.dto";
import { LoginUserDto } from "./login-accountUser.dto";

export class AccountUserService{
    constructor(
    @InjectRepository(AccountUserEntity)
    private userAccountRepository: Repository<AccountUserEntity>,
    // private authService: AuthService 
    ) {}


    createAccountUser(createdUserDto: AccountUserDto): Observable<AccountUserDto> {
        return
    }

    login(loginUserDto: LoginUserDto): Observable<string> {
        return
    }

    getAccountUsers(): Observable<AccountUserDto []> {
        return 
    }

    getAccountUserById(id: number): Observable<AccountUserDto> {
        return
    }

    private findAccountUserByEmail(email: string): Observable<AccountUserDto> {  
        return 
    }

    private validatePassword(password: string, storedPasswordHash: string): Observable<boolean> {
        return
    }

    private checkMailExists(email: string): Observable<boolean> {
        return
    }
}