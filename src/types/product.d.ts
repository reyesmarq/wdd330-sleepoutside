export type Product = {
  Id: string;
  NameWithoutBrand: string;
  Name: string;
  Image: string;
  SizesAvailable: Record<string, unknown>;
  Colors: {
    ColorCode: string;
    ColorName: string;
  }[];
  DescriptionHtmlSimple: string;
  SuggestedRetailPrice: number;
  Brand: {
    Id: string;
    LogoSrc: string;
    Name: string;
  };
  ListPrice: number;
  FinalPrice: number;
};
