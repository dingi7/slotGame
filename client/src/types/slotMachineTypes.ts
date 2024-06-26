export type Asset = {
    image: string;
    value: number;
  };

export type ColumnStateType = {
    assets: Asset[];
    spinning: boolean;
    middleRowIndex: number;
  };