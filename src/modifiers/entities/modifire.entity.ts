export class Modifier {
  id: string;
  title: string;
  price: number;
  value: string;
}

export class ModifierGroup {
  name: string;
  modifiers: Modifier[];
  defaultModifierId: string;
}
