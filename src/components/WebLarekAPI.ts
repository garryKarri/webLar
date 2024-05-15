import { Api, ApiListResponse } from './base/api';
import { IPill } from "../types";
import { ICard } from "../components/Card"
// export interface IWebLarekAPI {
//     getCardList: () => Promise<ICard[]>;
//     getCardItem: (id: string) => Promise<ICard>;
// }

// export class WebLarekAPI extends Api implements IWebLarekAPI {
//     readonly cdn: string;

//     constructor(cdn: string, baseUrl: string, options?: RequestInit) {
//         super(baseUrl, options);
//         this.cdn = cdn;
//     }

    // getCardList(): Promise<ICard[]> {
    //     return this.get(`/pill`).then((items: IPill[]) => {
    //         return items.map(item => ({
    //             ...item,
    //             imgUrl: this.cdn + item.imgUrl,
    //         }));
    //     });
    // }
    

    // getLotList(): Promise<ILot[]> {
    //     return this.get('/lot').then((data: ApiListResponse<ILot>) =>
    //         data.items.map((item) => ({
    //             ...item,
    //             image: this.cdn + item.image
    //         }))
    //     );
    // }
//     getCardItem(id: string): Promise<ICard> {
//         return this.get(`/pill/${id}`).then((item: IPill) => ({
//             ...item,
//             imgUrl: this.cdn + item.imgUrl,
//         }));
//     }
    
// }