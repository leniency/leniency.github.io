---
title: EntitySystems - Part 3
date: 2014-04-18
description: ""
categories: []
tags: ["C#","EntitySystems"]
layout: "../../layouts/BlogPost.astro"
---

# EntitySystems Part 3: EntityCollections

In part one we looked at the base for an Entity and EntityManager. In there we can create new entities and compose them of components. In part 2, we looked at actually storing components by their type.

When viewing an Entity System as a relational database, the component types are single table with the entity id as the primary key. Then entity represents a single joined row across multiple tables. Systems that consume entities will often rely on multiple component types. We could reference the component collections but that would require a lot of duplicate checking in each system to ensure that an entity contained all types it was looking for. Better to create a new type that tracks this for us.

##EntityCollection
```csharp
public sealed class EntityCollection : IEnumerable
{
    readonly EntityManager _manager;

    readonly Type[] _filter;
    readonly int _hashCode;
```

Each collection is composed a collection of types, so the first step is to store all of these types. These are used to make the hashcode for the collection. More explained in a bit.

```csharp
    readonly SortedSet _sortedEntities;
    readonly Dictionary _entities;
    readonly IComparer _comparer;
```

To store entities in the collection, we use two different internal collections. An entity collection has two big requirements - O(1) lookup and sorting. The sorted collections in C# don't offer O(1) lookup time and a plain Dictionary can't be sorted. The solution - use two collections. Dictionary offers the fastest lookup and SortedSet offers the most consistent insert speed. The comparer is just that - an optional custom comaprer for sorted entries (think z-indexed sprites, etc...)

```csharp
internal EntityCollection(EntityManager entityManager, Type[] types)
{
    _sortedEntities = new SortedSet();
    _hashCode = EntityCollection.GetHashCode(types, null);

    // Check that all types are really components
    if (!types.All(t => typeof(EntityComponent).IsAssignableFrom(t)))
    {
        throw new Exception("Type is not of IComponent - cannot filter.");
    }

    _manager = entityManager;
    _entities = new Dictionary();
    _filter = types;

    // Add any existing entites
    foreach (var entity in _manager)
    {
        if (MatchesFilter(entity))
        {
            Add(entity);
        }
    }
}

internal EntityCollection(EntityManager entityManager, Type[] types, Func comparer)
    : this(entityManager, types)
{
    // 
    var lambdaComparer = new Engine.Tools.LambdaComparer(comparer);

    _sortedEntities = new SortedSet(lambdaComparer);
    _hashCode = EntityCollection.GetHashCode(types, lambdaComparer);
}

internal EntityCollection(EntityManager entityManager, Type[] types, IComparer comparer)
    : this(entityManager, types)
{
    _sortedEntities = new SortedSet(comparer);
    _hashCode = EntityCollection.GetHashCode(types, comparer);
}

internal bool MatchesFilter(Entity entity)
{
    return _filter.All(t => entity.Is(t));
}
```

The constructor and most of the manipulations are internal. EntityCollections are not meant to be added to and removed from by the game classes. Systems that consume EntityCollection should only be iterating the collection. Use the EntityManager to manipulate entities - they will be automatically added/removed from EntityCollections.

Upon creation, the entity collection will search every entity and determine if it fits into the collection. Later as new entites are created or components removed, the EntityManager is responsible for notifiying collections about updates.

Seems like a good point to discus creating the hash code.

```csharp
public static int GetHashCode(Type[] types, IComparer comparer)
{
    var hashCode = 0;

    // Hashcode is build off the filters, independent of their order
    for (int i = 0; i < types.Length; i++)
        hashCode += types[i].GetHashCode();

    // Add on comparer hashcode if set - comparers should overload their
    // own GetHashCode to return a unique constant.
    hashCode += (comparer == null) ? 0 : comparer.GetHashCode();

    return hashCode;
}
```

Different consumers of EntityCollections may draw upon the same types. Rather than have multiple collections representing the same types, we provide a mechanism to cache them in the EntityManager (where they're built). The hash code is built from the types being monitored as well as the comparer.

```csharp
public delegate void EntityAddHandler(Entity entity);
public delegate void EntityRemoveHandler(Entity entity);
Systems consuming the collection like to be notified when the collection changes.

internal bool Add(Entity entity)
{
    // Check if the collection already contains this
    if (_entities.ContainsKey(entity.Id))
        return;

    // Ensure that the entity matches the filter
    if (!MatchesFilter(entity))
        return false;

    _entities.Add(entity.Id, entity);
    _sortedEntities.Add(entity);

    if (_entities.Count != _sortedEntities.Count)
        throw new Exception("EntityCollection internal collections don't match.  Probably a bad comparer for SortedSet.");

    // Notify any listeners that a new entity was added
    if (OnEntityAdd != null)
    {
        OnEntityAdd(entity);
    }
}
internal void Remove(Entity entity)
{
    // Check if the collection actually contains the entity
    if (!_entities.ContainsKey(entity.Id))
        return;

    // Notify any listeners that an entity was removed
    if (OnEntityRemove != null)
    {
        OnEntityRemove(entity);
    }

    _sortedEntities.Remove(entity);
    _entities.Remove(entity.Id);
}
```

Finally, Add and Remove do just that as well as notifiy any listeners. Notification is used to create or release resources or do extra initialization such as loading assets

There's a few more utility functions to be found in the full source.

## EntityManager

The EntityManager needs to have a few changes made to be able to present EntityCollections. First, add the internal collection storage and add two internal functions to handle collections.

```csharp
readonly Dictionary _collections;

internal void RemoveFromCollections(Entity e)
{
    // Remove entity from any collections
    foreach (var collection in _collections.Values)
    {
        collection.Remove(e);
    }
}

internal void RemoveFromCollections(Entity e, Type t)
{
    // Remove entity from any collections
    foreach (var collection in _collections.Values)
    {
        if (collection.ContainsType(t))
        {
            collection.Remove(e);
        }
    }
}
```

Second, we actually call these where appropriate.

```csharp
public Entity Create(IEnumerable components)
{
    ...
    AddToCollections(e);
    ...
}
public void Remove(Entity entity)
{
    RemoveFromCollections(entity);     // Call this one first
    Components.Remove(entity.Id);
    _entities.Remove(entity.Id);
}
```

And lastly, we need way to actually get the collections.

```csharp
public EntityCollection Get(params Type[] componentTypes)
{
    var hashCode = EntityCollection.GetHashCode(componentTypes);

    if (!_collections.ContainsKey(hashCode))
    {
        _collections.Add(hashCode, new EntityCollection(this, componentTypes));
    }

    return _collections[hashCode];
}

public EntityCollection Get(Type[] componentTypes, IComparer comparer)
{
    var hashCode = EntityCollection.GetHashCode(componentTypes, comparer);

    if (!_collections.ContainsKey(hashCode))
    {
        _collections.Add(hashCode, new EntityCollection(this, componentTypes, comparer));
    }

    return _collections[hashCode];
}
```

## Using Collections

```csharp
public MySystem(EntityManager manager)
{
    // Get the EntityCollection
    var entities = _entites = manager.Get(
        typeof(Foo),
        typeof(Bar));

    entities.OnEntityAdd += LoadComponent;
    entities.OnEntityAdd += UnloadComponent;
}

public void Draw(GameTime gameTime)
{
    foreach (var entity in _entities)
    {
        // Draw
    }
}

public void LoadComponent(Entity e)
{
    e.As().Texture = _contentManager.Load(e.As().AssetName);
}

public void UnloadComponent(Entity e)
{
    // Unload component
}
```

Consuming collections is pretty straight forward. The filter is created, events set, and it's good to go.