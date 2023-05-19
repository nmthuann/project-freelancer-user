import { Injectable } from '@nestjs/common';
import { Profile } from './profileDocument.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountUserService } from '../account-users/accountUser.service';
import { InformationUserService } from '../infor-users/inforUser.service';
import { ProfileUserService } from '../profile-users/profileUser.service';
import { ProfileDocumentDto } from './profile-document-dto/profileDocument.dto';;
import { UpdateProfileUserDto } from '../profile-users/profile-user-dto/update-profileUser.dto';
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


    //  find profile same as not fine -> đánh index for profile
    async getProfileByEmail(email: string){
        const profile = await this.profileModel.findOne({ email: email});
        return profile;
    }

    async isCreatedProfile(email: string){
        const profile = await this.profileModel.findOne({ email: email});
        if(profile && Object.keys(profile.profileDetail).length === 0){
            return false;
        }
        return true;
    }

    async CreateInformation(email:string, profileDto: ProfileDocumentDto) {

        // check email: email is exist in Database? -> not valid
        const checkEmail = await this.accountUserService.getAccountUserByEmail(email);
        if (!checkEmail) return "email khong hop le";
        else{
           

            // get Infor id in other to create or update?
            const getInforId: number = 
            (await this.informationUserService.getInforIdByEmail(email));
            console.log(getInforId)
            if (!getInforId){ // getInforId == null
                 const createdProfile = new this.profileModel();

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

                // create Information - MySQL
                await this.informationUserService.createInformationUser(inforNew);

                createdProfile.email = email ;
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

                // Create Profile - NoSQL
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
                const test = 
                await this.informationUserService.updateInformationUserById(getInforId, updateInfor);
                console.log("updaInfor: ", test )

                const test2 = await this.profileModel.updateOne(
                    (await this.profileModel.findOne({ email: email })), 
                    updateInfor
                );

                return await this.profileModel.findOne({ email: email });
            }
        }
    }

    async CreateProfile(email:string, profileDetailDto: CreateProfileDetailDto) {
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
                    newProfileMySql.infor = 
                    await this.informationUserService.getInformationUserById(getInforId);
                    newProfileMySql.avatar = profileDetailDto.avatar;
                    newProfileMySql.my_skill = profileDetailDto.mySkill;
                    newProfileMySql.occupation = profileDetailDto.occupation;
                    
                    const test = 
                    await this.profileUserService.createProfileUser(newProfileMySql);
                    console.log("checktest - MySQL: ", test);

                    await this.profileModel.findOneAndUpdate({email:email}, 
                        { $set: {profileDetail: profileDetailDto}});
                    return await this.profileModel.findOne({ email: email });
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

                const test2 = await this.profileModel.updateOne(
                    (await this.profileModel.findOne({ email: email })), 
                    {profileDetail: updateProfileMySql}
                );

                return await this.profileModel.findOne({ email: email });
            }
        }
    }


    async getFreelancerName(get_user: string){
    const findUser = await this.accountUserService.getAccountUserByEmail(get_user);
    if (findUser){
      const check = await this.isCreatedProfile(get_user);
      if(!check) return "Fail"
      const freelancer = await this.getProfileByEmail(get_user);
      const fullname = freelancer.first_name + ' ' + freelancer.last_name;
      return fullname;
    }
    return "Fail"
  }
}