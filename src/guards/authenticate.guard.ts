import {CanActivate, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../../prisma.service";


export class AuthenticateGuard implements CanActivate {
    constructor(private  readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers["authorization"];

        if(!authHeader){
            throw new UnauthorizedException("Please provide an authorization method")
        }

        const [bearer,token] = authHeader.split(' ');

        if(bearer !== "Bearer" || !token) {
            throw new UnauthorizedException("Auth header should be type Bearer")
        }

        const session = await this.prisma.session.findUnique({
            where:{
                accessToken:token,
            },
            include:{
                user:true
            }
        })

        if(!session){
            throw new UnauthorizedException("Session is not found")
        }

        const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil)

        if(isAccessTokenExpired){
            throw new UnauthorizedException("Access token expired");
        }

        if(!session.user) {
            throw new UnauthorizedException("User not found")
        }

        request.user = session.user;
        return true
    }
}