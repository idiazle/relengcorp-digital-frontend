import { Entity } from "../_models/entity.model";

export const emptyEntityForm: Entity = {
  name: '',
  type: 1,
  tag: '',
  attachment: '',
  parent: null,
  extra_info: null,
  deleted: false
}
