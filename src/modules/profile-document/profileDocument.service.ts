import { Injectable } from '@nestjs/common';
import { Profile } from './profileDocument.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountUserService } from '../account-users/accountUser.service';
import { InformationUserService } from '../infor-users/inforUser.service';
import { ProfileUserService } from '../profile-users/profileUser.service';
import { ProfileDocumentDto } from './profile-document-dto/profileDocument.dto';;
import { CreateProfileUserDto } from '../profile-users/profile-user-dto/create-profileUser.dto';
import { UpdateProfileUserDto } from '../profile-users/profile-user-dto/update-profileUser.dto';
import { UpdateProfileDocumentDto } from './profile-document-dto/update-profileDocument.dto';
import { CreateInformationUserDto } from '../infor-users/infor-user-dto/create-inforUser.dto';
import { CreateProfileDetailDto } from './profile-document-dto/create-profileDetail.dto';
import { UpdateInformationUserDto } from '../infor-users/infor-user-dto/update-inforUser.dto';
import { ProfileUserDto } from '../profile-users/profile-user-dto/profileUser.dto';

@Injectable()
export class ProfileDocumentService {
  constructor(
    @InjectModel(Profile.name) 
    private profileModel: Model<Profile>,
    private accountUserService: AccountUserService,
    private informationUserService: InformationUserService,
    private profileUserService: ProfileUserService,
    ) {}

    async getProfiles(): Promise<Profile[]>{
        try {
            const profiles = await this.profileModel.find();
            return profiles;
        } catch (err) {
            throw new Error(`Failed to get profile: ${err}`);
        }
    }


    async CreateProfile(profileDto: ProfileDocumentDto) {
        const createdProfile = new this.profileModel();

        // check email: email is exist in Database? -> not valid
        const checkEmail = await this.accountUserService.getAccountUserByEmail(profileDto.email);
        if (!checkEmail) return "email khong hop le";
        else{
            // get Infor id in other to create or update?
            const getInforId: number = (await this.informationUserService.getInforIdByEmail(profileDto.email));
            console.log(getInforId)
            if (!getInforId){ // getInforId == null
                const inforNew = new CreateInformationUserDto();


                inforNew.account = checkEmail;
                inforNew.first_name = profileDto.first_name;
                inforNew.last_name = profileDto.last_name;
                inforNew.gender = profileDto.gender;
                inforNew.birthday = profileDto.birthday;
                inforNew.phone = profileDto.phone;
                inforNew.address = profileDto.address ;
                inforNew.education = profileDto.education ;
                console.log("check InforNew:", inforNew)
                await this.informationUserService.createInformationUser(inforNew);

                createdProfile.email = profileDto.email ;
                createdProfile.first_name = profileDto.first_name ;
                createdProfile.last_name = profileDto.last_name ;
                createdProfile.gender = profileDto.gender ;
                createdProfile.birthday = profileDto.birthday ;
                createdProfile.address = profileDto.address ;
                createdProfile.phone = profileDto.phone;
                createdProfile.education = profileDto.education ;
                createdProfile.profileDetail = null;

                

                console.log("inforNew SQL:", inforNew);
                console.log("createdProfile NoSQL:", createdProfile);
                return createdProfile.save();
            }
            else{
                // update
                const updateInfor = new UpdateInformationUserDto();
                updateInfor .first_name = profileDto.first_name;
                updateInfor.last_name = profileDto.last_name;
                updateInfor.gender = profileDto.gender;
                updateInfor.birthday = profileDto.birthday;
                updateInfor.phone = profileDto.phone;
                updateInfor.address = profileDto.address ;
                updateInfor.education = profileDto.education ;
                const test = await this.informationUserService.updateInformationUserById(getInforId, updateInfor);
                console.log("updaInfor: ", test )

                createdProfile.email = profileDto.email ;
                createdProfile.first_name = profileDto.first_name ;
                createdProfile.last_name = profileDto.last_name ;
                createdProfile.gender = profileDto.gender ;
                createdProfile.birthday = profileDto.birthday ;
                createdProfile.address = profileDto.address ;
                createdProfile.phone = profileDto.phone;
                createdProfile.education = profileDto.education ;
                createdProfile.profileDetail = null;
                return createdProfile.save();
            }
        }
    }

    async CreateProfileDetail(email:string, profileDetailDto: CreateProfileDetailDto) {
        //const createdProfile = new this.profileModel();
        // check email
        const checkEmail = await this.profileModel.findOne({
            email: email
        })
        console.log("fix er chay",checkEmail);
        if (!checkEmail) return "email khong hop le";
        else{
            if (checkEmail.profileDetail == null) // check here
            {
                const getInforId = await this.informationUserService.getInforIdByEmail(email);
                console.log(getInforId);
                if (getInforId==0){
                    return "Bạn chưa cập nhật thông tin người dùng";
                }
                else{ 
                    //new create
                    const newProfileMySql = new ProfileUserDto();
                    newProfileMySql.infor = await this.informationUserService.getInformationUserById(getInforId);
                    newProfileMySql.avatar = profileDetailDto.avatar;
                    newProfileMySql.my_skill = profileDetailDto.mySkill;
                    newProfileMySql.occupation = profileDetailDto.occupation;

                    const test = await this.profileUserService.createProfileUser(newProfileMySql);
                    console.log("checktest: ", test);

                    // create
                    console.log("checktest: ", checkEmail.profileDetail)
                    

                    // checkEmail.profileDetail.mySkill = profileDetailDto.mySkill;
                    // checkEmail.profileDetail.avatar = profileDetailDto.avatar;
                    
                    // //checkEmail.profileDetail.level = profileDetailDto.level;
                    // checkEmail.profileDetail.occupation = profileDetailDto.occupation;

                    console.log("checkEmail - create: ", checkEmail);
                    return await this.profileModel.findOneAndUpdate({email:email}, 
                        { $set: {profileDetail: profileDetailDto}});
                }
            }
            else{
                //update

                const updateProfileMySql = new UpdateProfileUserDto();
                updateProfileMySql.avatar = profileDetailDto.avatar;
                updateProfileMySql.my_skill = profileDetailDto.mySkill;
                updateProfileMySql.occupation = profileDetailDto.occupation;
                updateProfileMySql.level = profileDetailDto.level;

                const updatedProfile = 
                await this.profileUserService.updateProfileUserById(
                    (await this.profileUserService.getProfileIdByEmail(email)), updateProfileMySql)

                checkEmail.profileDetail.avatar = profileDetailDto.avatar;
                checkEmail.profileDetail.mySkill = profileDetailDto.mySkill;
                checkEmail.profileDetail.level = profileDetailDto.level;
                checkEmail.profileDetail.occupation = profileDetailDto.occupation;
                
                console.log("checkEmail - Update: ",checkEmail);
                return checkEmail.save();
            }
        }
    }
}