import {
  Entity,
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  PointerEvents,
  PointerEventType,
  InputAction,
  GltfContainer,
  ColliderLayer,
  TextShape,
  Billboard,
  BillboardMode,
  Material,
  PBMaterial_PbrMaterial,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { REGISTRY } from '../registry'


export function destroySpacePartition(){
  if(REGISTRY.spacePartioner){
    REGISTRY.spacePartioner.reset()
    REGISTRY.spacePartioner = undefined as any
  }
}