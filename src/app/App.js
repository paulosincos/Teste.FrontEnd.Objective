import SearchBox from './SearchBox.js';
import CharacterList from './CharacterList.js';
import Paginator from './Paginator.js';
import Loader from './Loader.js';
import CharacterDetailModal from './CharacterDetailModal.js';

export default class App {
  constructor() {
    SearchBox.register();
    CharacterList.register();
    Paginator.register();
    Loader.register();
    CharacterDetailModal.register();
  }
}