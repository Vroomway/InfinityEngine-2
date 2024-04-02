import { REGISTRY } from '../registry'


export function destroySpacePartition(){
  if(REGISTRY.spacePartioner){
    REGISTRY.spacePartioner.reset()
    REGISTRY.spacePartioner = undefined as any
  }
}